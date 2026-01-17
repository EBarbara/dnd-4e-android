import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, IconButton, Chip } from 'react-native-paper';
import { Character, AbilityScores } from '../types';
import {
    calculateAttributeModifier,
    calculateModifierPlusHalfLevel,
    calculateTotalPointsSpent,
    POINTS_BUDGET,
    calculateAttributeCost
} from '../utils/gameRules';

interface CharacterFormProps {
    initialValues?: Partial<Character>;
    onSubmit: (values: Partial<Character>) => void;
    submitLabel?: string;
    mode?: 'create' | 'edit';
}

export const CharacterForm = ({
    initialValues,
    onSubmit,
    submitLabel = 'Save',
    mode = 'edit' // Default to edit to be safe, but create screens should pass 'create'
}: CharacterFormProps) => {
    const [name, setName] = useState(initialValues?.name || '');
    const [race, setRace] = useState(initialValues?.race || '');
    const [charClass, setCharClass] = useState(initialValues?.class || '');
    const [level, setLevel] = useState(initialValues?.level?.toString() || '1');
    const [abilities, setAbilities] = useState<AbilityScores>(initialValues?.abilities || {
        str: 10, con: 10, dex: 10, int: 10, wis: 10, cha: 10
    });

    const pointsSpent = useMemo(() => calculateTotalPointsSpent(abilities as unknown as Record<string, number>), [abilities]);
    const pointsRemaining = POINTS_BUDGET - pointsSpent;
    const isPointsValid = pointsRemaining === 0;

    // Check if all attributes are within 8-18 range for "Legal" status
    const areAttributesInRange = useMemo(() => {
        return Object.values(abilities).every(val => val >= 8 && val <= 18);
    }, [abilities]);

    const isLegal = isPointsValid && areAttributesInRange;

    const handleAbilityChange = (ability: keyof AbilityScores, value: string) => {
        const numValue = parseInt(value) || 0;
        setAbilities(prev => ({ ...prev, [ability]: numValue }));
    };

    const incrementAbility = (ability: keyof AbilityScores) => {
        setAbilities(prev => {
            const current = prev[ability];
            if (current >= 18) return prev; // Max 18

            // Check if we have enough points
            // Cost to go from current to current+1
            // Actually, we should just check if pointsRemaining >= cost difference
            // But simple way: calculate new cost
            const nextVal = current + 1;
            /* 
               We allow incrementing even if it makes points negative (Houseruled),
               BUT the prompt said: "Enforce 'Not enough points' constraint on increment" 
               in the plan?
               Wait, plan said: "Enforce 'Not enough points' constraint on increment."
               BUT newer prompt said: "Validation shouldn't prevent creation, just indicate status".
               AND "Allow free editing as infinite reasons exist".
               
               For 'create' mode: strict point buy usually prevents going over budget in the UI to guide the user?
               Or should we allow going over and just say "Houseruled -2 points"?
               User said: "A validação não deve impedir a criação... apenas indicar que ele é 'houseruled' ou 'legal'".
               This implies we CAN start with a houseruled char.
               However, typical Point Buy UIs block you from spending points you don't have.
               Let's allow it but show negative points. It's more flexible.
               
               Actually, standard Point Buy calculators STOP you at the limit.
               But "Houseruled" implies we can break the rules.
               So I will ALLOW going beyond, but show negative remaining points.
            */
            return { ...prev, [ability]: nextVal };
        });
    };

    const decrementAbility = (ability: keyof AbilityScores) => {
        setAbilities(prev => {
            const current = prev[ability];
            // Enforce min 8 for point buy UI
            if (current <= 8) return prev;
            return { ...prev, [ability]: current - 1 };
        });
    };

    const handleSubmit = () => {
        onSubmit({
            name,
            race,
            class: charClass,
            level: parseInt(level) || 1,
            abilities,
        });
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Character Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
            />
            <View style={styles.row}>
                <TextInput
                    label="Level"
                    value={level}
                    onChangeText={(text) => setLevel(text.replace(/[^0-9]/g, ''))}
                    style={[styles.input, styles.halfInput]}
                    mode="outlined"
                    keyboardType="numeric"
                />
                <TextInput
                    label="Race"
                    value={race}
                    onChangeText={setRace}
                    style={[styles.input, styles.halfInput]}
                    mode="outlined"
                />
            </View>
            <TextInput
                label="Class"
                value={charClass}
                onChangeText={setCharClass}
                style={styles.input}
                mode="outlined"
            />

            <View style={styles.abilitiesContainer}>
                <View style={styles.headerRow}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Attributes</Text>
                    {mode === 'create' && (
                        <Chip
                            icon={isLegal ? "check" : "alert-circle-outline"}
                            style={[styles.statusChip, isLegal ? styles.legalChip : styles.houseruledChip]}
                            textStyle={{ color: 'white' }}
                        >
                            {isLegal ? "Legal" : "Houseruled"}
                        </Chip>
                    )}
                </View>

                {mode === 'create' && (
                    <View style={styles.pointsContainer}>
                        <Text style={styles.pointsLabel}>Points Remaining:</Text>
                        <Text style={[
                            styles.pointsValue,
                            pointsRemaining < 0 ? styles.pointsNegative : styles.pointsPositive
                        ]}>
                            {pointsRemaining}
                        </Text>
                    </View>
                )}

                {(Object.keys(abilities) as Array<keyof AbilityScores>).map((ability) => {
                    const value = abilities[ability];
                    const mod = calculateAttributeModifier(value);
                    const modPlusHalf = calculateModifierPlusHalfLevel(value, parseInt(level) || 1);

                    return (
                        <View key={ability} style={styles.abilityRow}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.abilityLabel}>{ability.toUpperCase()}</Text>

                                {mode === 'create' ? (
                                    <View style={styles.numberControl}>
                                        <IconButton
                                            icon="minus"
                                            size={20}
                                            onPress={() => decrementAbility(ability)}
                                            mode="contained"
                                            containerColor="#444"
                                            iconColor="white"
                                        />
                                        <Text style={styles.valueText}>{value}</Text>
                                        <IconButton
                                            icon="plus"
                                            size={20}
                                            onPress={() => incrementAbility(ability)}
                                            mode="contained"
                                            containerColor="#444"
                                            iconColor="white"
                                        />
                                    </View>
                                ) : (
                                    <TextInput
                                        value={value.toString()}
                                        onChangeText={(text) => handleAbilityChange(ability, text.replace(/[^0-9]/g, ''))}
                                        style={[styles.input, styles.abilityInput]}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        dense
                                    />
                                )}
                            </View>

                            <View style={styles.modifierContainer}>
                                <Text style={styles.modifierLabel}>Mod</Text>
                                <Text style={styles.modifierValue}>{mod >= 0 ? '+' : ''}{mod}</Text>
                            </View>
                            <View style={styles.modifierContainer}>
                                <Text style={styles.modifierLabel}>Mod+½Lvl</Text>
                                <Text style={styles.modifierValue}>{modPlusHalf >= 0 ? '+' : ''}{modPlusHalf}</Text>
                            </View>
                        </View>
                    );
                })}
            </View>

            <Button mode="contained" onPress={handleSubmit} style={styles.button}>
                {submitLabel}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#2c2c2c',
    },
    halfInput: {
        flex: 1,
    },
    button: {
        marginTop: 16,
        backgroundColor: '#d32f2f',
    },
    abilitiesContainer: {
        marginTop: 16,
        gap: 8,
    },
    sectionTitle: {
        color: 'white',
    },
    abilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#262626',
        padding: 8,
        borderRadius: 8,
    },
    inputGroup: {
        flex: 2,
        flexDirection: 'column',
        gap: 4,
    },
    abilityLabel: {
        color: '#aaa',
        fontWeight: 'bold',
        fontSize: 12,
    },
    abilityInput: {
        textAlign: 'center',
        height: 40,
    },
    numberControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        borderRadius: 4,
    },
    valueText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        minWidth: 24,
        textAlign: 'center',
    },
    modifierContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modifierLabel: {
        color: '#777',
        fontSize: 10,
        marginBottom: 2,
    },
    modifierValue: {
        color: '#e0e0e0',
        fontSize: 16,
        fontWeight: 'bold',
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 8,
        marginBottom: 8,
        backgroundColor: '#333',
        padding: 8,
        borderRadius: 4,
    },
    pointsLabel: {
        color: '#ccc',
    },
    pointsValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    pointsPositive: {
        color: '#4caf50',
    },
    pointsNegative: {
        color: '#f44336',
    },
    statusChip: {
        height: 32,
    },
    legalChip: {
        backgroundColor: '#2e7d32',
    },
    houseruledChip: {
        backgroundColor: '#c62828',
    }
});
