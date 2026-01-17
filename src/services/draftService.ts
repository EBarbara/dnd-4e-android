
import { getDB } from './database';
import { Character, createDefaultCharacter } from '../types';

export const DraftService = {
    // Create a new draft with a generated ID and default character data
    createDraft: async (): Promise<string> => {
        const db = await getDB();
        const id = Date.now().toString();
        const defaultChar = createDefaultCharacter();
        defaultChar.id = id;

        await db.runAsync(
            'INSERT INTO character_drafts (id, step, data) VALUES (?, ?, ?)',
            id, 1, JSON.stringify(defaultChar)
        );
        return id;
    },

    // Get a draft by ID
    getDraft: async (id: string): Promise<{ step: number; data: Character } | null> => {
        const db = await getDB();
        const result = await db.getFirstAsync<{ step: number; data: string }>(
            'SELECT step, data FROM character_drafts WHERE id = ?',
            id
        );

        if (!result) return null;
        return {
            step: result.step,
            data: JSON.parse(result.data)
        };
    },

    // Get all drafts
    getDrafts: async (): Promise<{ id: string; step: number; data: Character }[]> => {
        const db = await getDB();
        const results = await db.getAllAsync<{ id: string; step: number; data: string }>(
            'SELECT id, step, data FROM character_drafts ORDER BY id DESC'
        );

        return results.map(row => ({
            id: row.id,
            step: row.step,
            data: JSON.parse(row.data)
        }));
    },

    // Update draft data and optional step
    updateDraft: async (id: string, updates: Partial<Character>, step?: number): Promise<void> => {
        const db = await getDB();

        // First get current data to merge
        const currentResult = await db.getFirstAsync<{ data: string }>('SELECT data FROM character_drafts WHERE id = ?', id);
        if (!currentResult) throw new Error('Draft not found');

        const currentData = JSON.parse(currentResult.data);
        const newData = { ...currentData, ...updates };

        if (step !== undefined) {
            await db.runAsync(
                'UPDATE character_drafts SET data = ?, step = ? WHERE id = ?',
                JSON.stringify(newData), step, id
            );
        } else {
            await db.runAsync(
                'UPDATE character_drafts SET data = ? WHERE id = ?',
                JSON.stringify(newData), id
            );
        }
    },

    // Delete a draft
    deleteDraft: async (id: string): Promise<void> => {
        const db = await getDB();
        await db.runAsync('DELETE FROM character_drafts WHERE id = ?', id);
    },

    // Save draft as real character
    saveCharacter: async (id: string): Promise<void> => {
        const db = await getDB();
        const draft = await DraftService.getDraft(id);

        if (!draft) throw new Error("Draft not found");

        const char = draft.data;
        // Separate core fields for columns vs JSON blob
        const { id: _, name, level, race, class: charClass, ...rest } = char;
        const dataStr = JSON.stringify(rest);

        await db.withTransactionAsync(async () => {
            await db.runAsync(
                'INSERT INTO characters (id, name, level, race, class, data) VALUES (?, ?, ?, ?, ?, ?)',
                char.id, name, level, race, charClass, dataStr
            );
            await db.runAsync('DELETE FROM character_drafts WHERE id = ?', id);
        });
    }
};
