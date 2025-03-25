const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Load JSON data
const moodsData = JSON.parse(fs.readFileSync('moods.json', 'utf8'));
const moodHistoryData = JSON.parse(fs.readFileSync('mood_history.json', 'utf8'));

// Open database connection
const db = new sqlite3.Database('moodTracker.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
        return;
    }
    console.log("Connected to SQLite database.");
});

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            emoji TEXT NOT NULL,
            title TEXT UNIQUE NOT NULL,
            category TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS mood_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            mood_id INTEGER NOT NULL,
            detail TEXT,
            FOREIGN KEY (mood_id) REFERENCES moods(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS initial_moods (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            history_id INTEGER NOT NULL,
            mood_title TEXT NOT NULL,
            FOREIGN KEY (history_id) REFERENCES mood_history(id)
        )
    `);

    console.log("Database setup completed.");

    // Insert moods
    const insertMood = db.prepare("INSERT OR IGNORE INTO moods (emoji, title, category) VALUES (?, ?, ?)");

    moodsData.positive_moods.forEach(mood => {
        if (mood.title) insertMood.run(mood.emoji, mood.title.trim(), "positive");
    });
    moodsData.neutral_moods.forEach(mood => {
        if (mood.title) insertMood.run(mood.emoji, mood.title.trim(), "neutral");
    });
    moodsData.negative_moods.forEach(mood => {
        if (mood.title) insertMood.run(mood.emoji, mood.title.trim(), "negative");
    });

    insertMood.finalize();
    console.log("Inserted mood data.");

    // Insert mood history properly
    const insertHistory = db.prepare("INSERT INTO mood_history (user_id, date, mood_id, detail) VALUES (?, ?, ?, ?)");

    let insertCount = 0;
    let totalInserts = 0;

    moodHistoryData.forEach(user => {
        totalInserts += user.history.length;
    });

    moodHistoryData.forEach(user => {
        user.history.forEach(entry => {
            if (!entry.initialMoods || entry.initialMoods.length === 0) {
                console.error("⚠️ Skipping entry due to missing initialMoods:", entry);
                return;
            }

            const moodTitle = entry.initialMoods[0] ? entry.initialMoods[0].trim() : null;
            if (!moodTitle) {
                console.error("⚠️ Skipping entry due to missing mood title:", entry);
                return;
            }

            db.get("SELECT id FROM moods WHERE title = ?", [moodTitle], (err, row) => {
                if (err) {
                    console.error("Error fetching mood ID:", err.message);
                    return;
                }

                if (!row) {
                    console.error(`⚠️ Mood title "${moodTitle}" not found in database.`);
                    return; // Skip insertion if mood not found
                }

                const moodId = row.id;

                insertHistory.run(user.user_id, entry.date, moodId, entry.detail, function(err) {
                    if (err) {
                        console.error("Error inserting history:", err.message);
                        return;
                    }

                    // Insert initial moods
                    const historyId = this.lastID;
                    const insertInitialMood = db.prepare("INSERT INTO initial_moods (history_id, mood_title) VALUES (?, ?)");

                    entry.initialMoods.forEach(moodTitle => {
                        if (moodTitle) insertInitialMood.run(historyId, moodTitle.trim());
                    });

                    insertInitialMood.finalize();

                    insertCount++;

                    // ✅ Finalize insertHistory only when all entries are inserted
                    if (insertCount === totalInserts) {
                        insertHistory.finalize();
                        console.log("Inserted mood history data.");

                        // ✅ Close database after inserts
                        db.close((err) => {
                            if (err) {
                                console.error("Error closing database:", err.message);
                            } else {
                                console.log("Database closed.");
                            }
                        });
                    }
                });
            });
        });
    });
});
