import * as SQLite from 'expo-sqlite';
import racesData from '../../data/races.json';
import classesData from '../../data/classes.json';
import skillsData from '../../data/skills.json';
import featsData from '../../data/feats.json';
import powersData from '../../data/powers.json';

const DB_NAME = 'dnd4e_v2.db';

import { Platform } from 'react-native';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export const getDB = async () => {
    if (dbPromise) {
        return dbPromise;
    }

    dbPromise = (async () => {
        try {
            if (Platform.OS === 'web') {
                const db = await SQLite.openDatabaseAsync(DB_NAME);
                // Verify db connection immediately on web to catch wa-sqlite errors early
                await db.execAsync('SELECT 1');
                return db;
            }
            return await SQLite.openDatabaseAsync(DB_NAME);
        } catch (error) {
            if (Platform.OS === 'web') {
                console.warn("WebSQLiteOpenError: Failed to open database. This is likely due to missing 'Cross-Origin-Opener-Policy' and 'Cross-Origin-Embedder-Policy' headers required for SharedArrayBuffer.", error);
            }
            // Reset promise on failure so we can try again
            dbPromise = null;
            throw error;
        }
    })();

    return dbPromise;
};

export const initDatabase = async () => {
    console.log('Initializing database...');
    try {
        const db = await getDB();
        console.log('Database opened successfully.');

        console.log('Creating tables...');
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            
            CREATE TABLE IF NOT EXISTS meta (
                key TEXT PRIMARY KEY, 
                value TEXT
            );

            CREATE TABLE IF NOT EXISTS races (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                quote TEXT,
                description TEXT,
                ability_scores TEXT,
                size TEXT,
                speed TEXT,
                vision TEXT,
                languages TEXT,
                defense_bonuses TEXT
            );

            CREATE TABLE IF NOT EXISTS race_traits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                race_id INTEGER,
                trait TEXT,
                FOREIGN KEY (race_id) REFERENCES races (id)
            );

            CREATE TABLE IF NOT EXISTS classes (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                role TEXT, 
                source TEXT
            );

            CREATE TABLE IF NOT EXISTS skills (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                ability TEXT, 
                trained INTEGER
            );

            CREATE TABLE IF NOT EXISTS feats (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                tier TEXT, 
                prerequisite TEXT, 
                benefit TEXT
            );

            CREATE TABLE IF NOT EXISTS powers (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                level INTEGER, 
                type TEXT, 
                class TEXT, 
                action TEXT, 
                range TEXT
            );

            CREATE TABLE IF NOT EXISTS characters (
                id TEXT PRIMARY KEY,
                name TEXT,
                level INTEGER,
                race TEXT,
                class TEXT,
                data TEXT
            );


        `);
        console.log('Tables created successfully.');

        await seedCompendium(db);
    } catch (error) {
        console.error('Fatal error during database initialization:', error);
    }
};

const seedCompendium = async (db: SQLite.SQLiteDatabase) => {
    try {
        console.log('Checking compendium seed status...');
        // Check if meta table exists first just in case
        const result = await db.getFirstAsync<{ value: string }>('SELECT value FROM meta WHERE key = ?', 'compendium_version');
        console.log('Current version in DB:', result?.value);

        const currentVersion = '1.5';

        if (!result || result.value !== currentVersion) {
            console.log('Seeding compendium data... (This may take a moment)');

            await db.withTransactionAsync(async () => {
                console.log('Clearing old data...');
                // Drop and recreate races table to ensure schema definition is up to date
                await db.execAsync(`
                    DROP TABLE IF EXISTS races;
                    CREATE TABLE races (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        name TEXT, 
                        quote TEXT,
                        description TEXT,
                        ability_scores TEXT,
                        size TEXT,
                        speed TEXT,
                        vision TEXT,
                        languages TEXT,
                        defense_bonuses TEXT
                    );

                    DELETE FROM race_traits;
                    DELETE FROM classes;
                    DELETE FROM skills;
                    DELETE FROM feats;
                    DELETE FROM powers;
                `);

                console.log('Inserting races...');
                for (const race of racesData) {
                    const result = await db.runAsync(
                        'INSERT INTO races (name, quote, description, ability_scores, size, speed, vision, languages, defense_bonuses) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                        race.name,
                        race.quote,
                        race.description,
                        race.ability_scores,
                        race.size,
                        race.speed,
                        race.vision,
                        race.languages,
                        race.defense_bonuses
                    );
                    const raceId = result.lastInsertRowId;
                    for (const trait of race.traits) {
                        await db.runAsync('INSERT INTO race_traits (race_id, trait) VALUES (?, ?)', raceId, trait);
                    }
                }

                console.log('Inserting classes...');
                for (const cls of classesData) {
                    await db.runAsync('INSERT INTO classes (name, role, source) VALUES (?, ?, ?)', cls.name, cls.role, cls.source);
                }

                console.log('Inserting skills...');
                for (const skill of skillsData) {
                    await db.runAsync('INSERT INTO skills (name, ability, trained) VALUES (?, ?, ?)', skill.name, skill.ability, skill.trained ? 1 : 0);
                }

                console.log('Inserting feats...');
                for (const feat of featsData) {
                    await db.runAsync('INSERT INTO feats (name, tier, prerequisite, benefit) VALUES (?, ?, ?, ?)', feat.name, feat.tier, feat.prerequisite, feat.benefit);
                }

                console.log('Inserting powers...');
                for (const power of powersData) {
                    await db.runAsync('INSERT INTO powers (name, level, type, class, action, range) VALUES (?, ?, ?, ?, ?, ?)', power.name, power.level, power.type, power.class, power.action, power.range);
                }

                console.log('Updating metadata...');
                await db.runAsync('INSERT OR REPLACE INTO meta (key, value) VALUES (?, ?)', 'compendium_version', currentVersion);
            });
            console.log('Compendium seeding complete.');
        } else {
            console.log('Compendium already up to date.');
        }
    } catch (error) {
        console.error('Error seeding compendium:', error);
    }
};
