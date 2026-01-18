import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Button, Text, IconButton, Chip, Portal, Modal, Surface, List } from 'react-native-paper';
import { useCompendiumStore } from '../store/compendiumStore';
import { Character, AbilityScores } from '../types';
import {
    calculateAttributeModifier,
    calculateModifierPlusHalfLevel,
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

    const { races } = useCompendiumStore();
    const [showRaceSelector, setShowRaceSelector] = useState(false);

    const handleAbilityChange = (ability: keyof AbilityScores, value: string) => {
        const numValue = parseInt(value) || 0;
        setAbilities(prev => ({ ...prev, [ability]: numValue }));
    };

    const incrementAbility = (ability: keyof AbilityScores) => {
        setAbilities(prev => {
            const current = prev[ability];
            return { ...prev, [ability]: current + 1 };
        });
    };

    const decrementAbility = (ability: keyof AbilityScores) => {
        setAbilities(prev => {
            const current = prev[ability];
            if (current <= 1) return prev; // Min 1 is reasonable for D&D
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
                <TouchableOpacity onPress={() => setShowRaceSelector(true)} style={[styles.halfInput, { marginBottom: 6 }]}>
                    <TextInput
                        label="Race"
                        value={race}
                        editable={false}
                        style={styles.input}
                        mode="outlined"
                        right={<TextInput.Icon icon="chevron-down" onPress={() => setShowRaceSelector(true)} />}
                    />
                </TouchableOpacity>
            </View>

            <Portal>
                <Modal visible={showRaceSelector} onDismiss={() => setShowRaceSelector(false)} contentContainerStyle={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text variant="titleLarge" style={styles.modalTitle}>Select Race</Text>
                    </View>
                    <ScrollView style={styles.raceList}>
                        {races.map((r) => (
                            <List.Item
                                key={r.id}
                                title={r.name}
                                description={r.ability_scores}
                                onPress={() => {
                                    setRace(r.name);
                                    setShowRaceSelector(false);
                                }}
                                style={styles.raceItem}
                                titleStyle={{ color: 'white' }}
                                descriptionStyle={{ color: '#aaa' }}
                                right={props => race === r.name ? <List.Icon {...props} icon="check" color="#d32f2f" /> : null}
                            />
                        ))}
                    </ScrollView>
                </Modal>
            </Portal>
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
                </View>

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
    },
    modalContent: {
        backgroundColor: '#1e1e1e',
        margin: 20,
        borderRadius: 8,
        maxHeight: '80%',
        padding: 0,
        overflow: 'hidden',
    },
    modalHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        backgroundColor: '#252525',
    },
    modalTitle: {
        fontWeight: 'bold',
        color: 'white',
    },
    raceList: {
        // padding: 8,
    },
    raceItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#2c2c2c',
    }
});
