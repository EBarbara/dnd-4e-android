import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Character, createDefaultCharacter } from '../types';

interface CharacterState {
    characters: Character[];
    activeCharacterId: string | null;
    addCharacter: (partial?: Partial<Character>) => void;
    deleteCharacter: (id: string) => void;
    selectCharacter: (id: string) => void;
    updateCharacter: (id: string, updates: Partial<Character>) => void;
}

export const useCharacterStore = create<CharacterState>()(
    persist(
        (set) => ({
            characters: [],
            activeCharacterId: null,

            addCharacter: (partial) => set((state) => {
                const newChar = { ...createDefaultCharacter(), ...partial };
                return { characters: [...state.characters, newChar] };
            }),

            deleteCharacter: (id) => set((state) => ({
                characters: state.characters.filter((c) => c.id !== id),
                activeCharacterId: state.activeCharacterId === id ? null : state.activeCharacterId,
            })),

            selectCharacter: (id) => set({ activeCharacterId: id }),

            updateCharacter: (id, updates) => set((state) => ({
                characters: state.characters.map((c) =>
                    c.id === id ? { ...c, ...updates } : c
                ),
            })),
        }),
        {
            name: 'dnd-4e-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
