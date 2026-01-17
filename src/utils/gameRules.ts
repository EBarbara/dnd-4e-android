export const calculateHalfLevel = (level: number): number => {
    return Math.floor(level / 2);
};

export const calculateAttributeModifier = (attributeValue: number): number => {
    return Math.floor((attributeValue - 10) / 2);
};

export const calculateModifierPlusHalfLevel = (attributeValue: number, level: number): number => {
    return calculateAttributeModifier(attributeValue) + calculateHalfLevel(level);
};
