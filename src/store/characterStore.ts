import { create } from 'zustand';
import { getDB } from '../services/database';
import { Character, createDefaultCharacter } from '../types';

interface CharacterState {
    characters: Character[];
    activeCharacterId: string | null;
    isLoading: boolean;
    fetchCharacters: () => Promise<void>;
    addCharacter: (partial?: Partial<Character>) => Promise<void>;
    deleteCharacter: (id: string) => Promise<void>;
    selectCharacter: (id: string) => void;
    updateCharacter: (id: string, updates: Partial<Character>) => Promise<void>;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
    characters: [],
    activeCharacterId: null,
    isLoading: false,

    fetchCharacters: async () => {
        set({ isLoading: true });
        try {
            const db = await getDB();
            const result = await db.getAllAsync<{ id: string; name: string; level: number; race: string; class: string; data: string }>('SELECT * FROM characters');

            const characters: Character[] = result.map(row => {
                const data = JSON.parse(row.data);
                return {
                    id: row.id,
                    name: row.name,
                    level: row.level,
                    race: row.race,
                    class: row.class,
                    ...data
                };
            });

            set({ characters, isLoading: false });
        } catch (error) {
            console.error('Failed to fetch characters:', error);
            set({ isLoading: false });
        }
    },

    addCharacter: async (partial) => {
        const newChar = { ...createDefaultCharacter(), ...partial };
        // Separate core fields for columns vs JSON blob
        const { id, name, level, race, class: charClass, ...rest } = newChar;
        const dataStr = JSON.stringify(rest);

        try {
            const db = await getDB();
            await db.runAsync(
                'INSERT INTO characters (id, name, level, race, class, data) VALUES (?, ?, ?, ?, ?, ?)',
                id, name, level, race, charClass, dataStr
            );

            set((state) => ({ characters: [...state.characters, newChar] }));
        } catch (error) {
            console.error('Failed to add character:', error);
        }
    },

    deleteCharacter: async (id) => {
        try {
            const db = await getDB();
            await db.runAsync('DELETE FROM characters WHERE id = ?', id);

            set((state) => ({
                characters: state.characters.filter((c) => c.id !== id),
                activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId,
            }));
        } catch (error) {
            console.error('Failed to delete character:', error);
        }
    },

    selectCharacter: (id) => set({ activeCharacterId: id }),

    updateCharacter: async (id, updates) => {
        // Optimistic update
        const state = get();
        const existingChar = state.characters.find(c => c.id === id);
        if (!existingChar) return;

        const updatedChar = { ...existingChar, ...updates };

        // Prepare DB update
        const { id: _, name, level, race, class: charClass, ...rest } = updatedChar;
        const dataStr = JSON.stringify(rest);

        try {
            const db = await getDB();
            await db.runAsync(
                'UPDATE characters SET name = ?, level = ?, race = ?, class = ?, data = ? WHERE id = ?',
                name, level, race, charClass, dataStr, id
            );

            set({
                characters: state.characters.map((c) => (c.id === id ? updatedChar : c)),
            });
        } catch (error) {
            console.error('Failed to update character:', error);
            // Revert optimistic update? For now assume it works or just log error.
        }
    },
}));
