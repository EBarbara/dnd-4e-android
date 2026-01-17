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
                traits TEXT
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

            CREATE TABLE IF NOT EXISTS character_drafts (
                id TEXT PRIMARY KEY,
                step INTEGER DEFAULT 1,
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

        const currentVersion = '1.1';

        if (!result || result.value !== currentVersion) {
            console.log('Seeding compendium data... (This may take a moment)');

            await db.withTransactionAsync(async () => {
                console.log('Clearing old data...');
                await db.execAsync(`
                    DELETE FROM races;
                    DELETE FROM classes;
                    DELETE FROM skills;
                    DELETE FROM feats;
                    DELETE FROM powers;
                `);

                console.log('Inserting races...');
                for (const race of racesData) {
                    await db.runAsync('INSERT INTO races (name, traits) VALUES (?, ?)', race.name, race.traits);
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
