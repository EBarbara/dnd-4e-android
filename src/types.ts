export interface AbilityScores {
    str: number;
    con: number;
    dex: number;
    int: number;
    wis: number;
    cha: number;
}

export interface Defenses {
    ac: number;
    fort: number;
    ref: number;
    will: number;
}

export interface HitPoints {
    current: number;
    max: number;
    temp: number;
    surgeValue: number;
    surgesPerDay: number;
    surgesRemaining: number;
}

export interface Character {
    id: string;
    name: string;
    level: number;
    race: string;
    class: string;
    paragonPath?: string;
    epicDestiny?: string;

    abilities: AbilityScores;
    defenses: Defenses;
    hp: HitPoints;

    initiativeBonus: number;
    speed: number;
    passiveInsight: number;
    passivePerception: number;

    // To be expanded in later phases
    powers: any[];
    inventory: any[];
    skills: any[]; // e.g. trained skills
}

// Helper to create a default character
export const createDefaultCharacter = (): Character => ({
    id: Date.now().toString(),
    name: 'New Hero',
    level: 1,
    race: 'Human',
    class: 'Fighter',
    abilities: { str: 10, con: 10, dex: 10, int: 10, wis: 10, cha: 10 },
    defenses: { ac: 10, fort: 10, ref: 10, will: 10 },
    hp: { current: 20, max: 20, temp: 0, surgeValue: 5, surgesPerDay: 8, surgesRemaining: 8 },
    initiativeBonus: 0,
    speed: 6,
    passiveInsight: 10,
    passivePerception: 10,
    powers: [],
    inventory: [],
    skills: []
});
