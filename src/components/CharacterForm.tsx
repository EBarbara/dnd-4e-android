import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { Character } from '../types';

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

    const handleSubmit = () => {
        onSubmit({
            name,
            race,
            class: charClass,
            level: parseInt(level) || 1,
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
});
