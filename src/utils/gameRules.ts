export const calculateHalfLevel = (level: number): number => {
    return Math.floor(level / 2);
};

export const calculateAttributeModifier = (attributeValue: number): number => {
    return Math.floor((attributeValue - 10) / 2);
};

export const calculateModifierPlusHalfLevel = (attributeValue: number, level: number): number => {
    return calculateAttributeModifier(attributeValue) + calculateHalfLevel(level);
};

// Point Buy Logic

// Total points available: 22 points to spend + base attributes.
// Base assumption: 5 at 10 (cost 2 each = 10), 1 at 8 (cost 0).
// Total abstract points budget = 22 "spendable" + 10 "base value" = 32.
export const POINTS_BUDGET = 32;

export const ATTRIBUTE_COSTS: Record<number, number> = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
    16: 11,
    17: 14,
    18: 18,
};

export const calculateAttributeCost = (value: number): number => {
    if (value < 8) return 0; // Should not happen in point buy, but for safety
    if (value > 18) {
        // Extrapolate if necessary or max out. For point buy 18 is max.
        // If user manually inputs > 18, we can just return a high cost or extrapolate.
        // For now, let's return the max cost plus linear increase to discourage it?
        // Or just map to 18's cost?
        // The prompt says "Max is 18".
        return ATTRIBUTE_COSTS[18] || 18;
    }
    return ATTRIBUTE_COSTS[value] ?? 0;
};

export const calculateTotalPointsSpent = (abilities: { [key: string]: number }): number => {
    return Object.values(abilities).reduce((total, val) => total + calculateAttributeCost(val), 0);
};
