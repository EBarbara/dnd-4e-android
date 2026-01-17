import { create } from 'zustand';
import { getDB, initDatabase } from '../services/database';

interface Race { id: number; name: string; traits: string; }
interface Class { id: number; name: string; role: string; source: string; }
interface Skill { id: number; name: string; ability: string; trained: boolean; }
interface Feat { id: number; name: string; tier: string; prerequisite: string; benefit: string; }
interface Power { id: number; name: string; level: number; type: string; class: string; action: string; range: string; }

interface CompendiumState {
    races: Race[];
    classes: Class[];
    skills: Skill[];
    feats: Feat[];
    powers: Power[];
    isLoading: boolean;
    initialize: () => Promise<void>;
    fetchRaces: () => Promise<void>;
    fetchClasses: () => Promise<void>;
    fetchSkills: () => Promise<void>;
    fetchFeats: () => Promise<void>;
    fetchPowers: () => Promise<void>;
}

export const useCompendiumStore = create<CompendiumState>((set) => ({
    races: [],
    classes: [],
    skills: [],
    feats: [],
    powers: [],
    isLoading: true,

    initialize: async () => {
        set({ isLoading: true });
        try {
            await initDatabase();
            // Pre-load basic lists or wait for specific fetch calls
            // For now, let's load everything to mimic previous behavior but from DB
            // In a real large app, we would only fetch what is needed.
            const db = await getDB();

            const races = await db.getAllAsync<Race>('SELECT * FROM races');
            const classes = await db.getAllAsync<Class>('SELECT * FROM classes');
            const skillsRaw = await db.getAllAsync<any>('SELECT * FROM skills');
            const skills = skillsRaw.map(s => ({ ...s, trained: !!s.trained }));

            set({ races, classes, skills, isLoading: false });
        } catch (error) {
            console.error('Failed to initialize compendium:', error);
            set({ isLoading: false });
        }
    },

    fetchRaces: async () => {
        const db = await getDB();
        const races = await db.getAllAsync<Race>('SELECT * FROM races');
        set({ races });
    },

    fetchClasses: async () => {
        const db = await getDB();
        const classes = await db.getAllAsync<Class>('SELECT * FROM classes');
        set({ classes });
    },

    fetchSkills: async () => {
        const db = await getDB();
        const skillsRaw = await db.getAllAsync<any>('SELECT * FROM skills');
        const skills = skillsRaw.map(s => ({ ...s, trained: !!s.trained }));
        set({ skills });
    },

    fetchFeats: async () => {
        const db = await getDB();
        const feats = await db.getAllAsync<Feat>('SELECT * FROM feats');
        set({ feats });
    },

    fetchPowers: async () => {
        const db = await getDB();
        const powers = await db.getAllAsync<Power>('SELECT * FROM powers');
        set({ powers });
    }
}));
