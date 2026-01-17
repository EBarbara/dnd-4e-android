import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import compendiumData from '../data/compendium.json';

interface Race { name: string; traits: string; }
interface Class { name: string; role: string; source: string; }
interface Skill { name: string; ability: string; trained: boolean; }
interface Feat { name: string; tier: string; prerequisite: string; benefit: string; }
interface Power { name: string; level: number; type: string; class: string; action: string; range: string; }

interface CompendiumState {
    races: Race[];
    classes: Class[];
    skills: Skill[];
    feats: Feat[];
    powers: Power[];
    isInitialized: boolean;
    seedCompendium: () => void;
    resetCompendium: () => void;
}

export const useCompendiumStore = create<CompendiumState>()(
    persist(
        (set, get) => ({
            races: [],
            classes: [],
            skills: [],
            feats: [],
            powers: [],
            isInitialized: false,

            seedCompendium: () => {
                const { isInitialized } = get();
                if (!isInitialized) {
                    set({
                        races: compendiumData.races,
                        classes: compendiumData.classes,
                        skills: compendiumData.skills,
                        feats: compendiumData.feats,
                        powers: compendiumData.powers,
                        isInitialized: true,
                    });
                    console.log('Compendium seeded successfully.');
                }
            },

            resetCompendium: () => {
                set({
                    races: compendiumData.races,
                    classes: compendiumData.classes,
                    skills: compendiumData.skills,
                    feats: compendiumData.feats,
                    powers: compendiumData.powers,
                    isInitialized: true,
                });
                console.log('Compendium reset to defaults.');
            }
        }),
        {
            name: 'dnd-4e-compendium-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
