import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Character, AbilityScores } from '../types';
import { calculateAttributeModifier, calculateModifierPlusHalfLevel } from '../utils/gameRules';

interface CharacterFormProps {
    initialValues?: Partial<Character>;
    onSubmit: (values: Partial<Character>) => void;
    submitLabel?: string;
}

export const CharacterForm = ({ initialValues, onSubmit, submitLabel = 'Save' }: CharacterFormProps) => {
    const [name, setName] = useState(initialValues?.name || '');
    const [race, setRace] = useState(initialValues?.race || '');
    const [charClass, setCharClass] = useState(initialValues?.class || '');
    const [level, setLevel] = useState(initialValues?.level?.toString() || '1');
    const [abilities, setAbilities] = useState<AbilityScores>(initialValues?.abilities || {
        str: 10, con: 10, dex: 10, int: 10, wis: 10, cha: 10
    });

    const handleAbilityChange = (ability: keyof AbilityScores, value: string) => {
        const numValue = parseInt(value) || 0;
        setAbilities(prev => ({ ...prev, [ability]: numValue }));
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
                <Text variant="titleMedium" style={styles.sectionTitle}>Attributes</Text>
                {(Object.keys(abilities) as Array<keyof AbilityScores>).map((ability) => {
                    const value = abilities[ability];
                    const mod = calculateAttributeModifier(value);
                    const modPlusHalf = calculateModifierPlusHalfLevel(value, parseInt(level) || 1);

                    return (
                        <View key={ability} style={styles.abilityRow}>
                            <TextInput
                                label={ability.toUpperCase()}
                                value={value.toString()}
                                onChangeText={(text) => handleAbilityChange(ability, text.replace(/[^0-9]/g, ''))}
                                style={[styles.input, styles.abilityInput]}
                                mode="outlined"
                                keyboardType="numeric"
                            />
                            <View style={styles.modifierContainer}>
                                <Text style={styles.modifierLabel}>Mod:</Text>
                                <Text style={styles.modifierValue}>{mod >= 0 ? '+' : ''}{mod}</Text>
                            </View>
                            <View style={styles.modifierContainer}>
                                <Text style={styles.modifierLabel}>Mod + ½ Lvl:</Text>
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
        marginBottom: 8,
    },
    abilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    abilityInput: {
        flex: 1,
        maxWidth: 100,
    },
    modifierContainer: {
        flex: 1,
        alignItems: 'center',
    },
    modifierLabel: {
        color: '#aaa',
        fontSize: 12,
    },
    modifierValue: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
