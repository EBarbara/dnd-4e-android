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

    const handleSubmit = () => {
        onSubmit({
            name,
            race,
            class: charClass,
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
            <TextInput
                label="Race"
                value={race}
                onChangeText={setRace}
                style={styles.input}
                mode="outlined"
            />
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
    input: {
        backgroundColor: '#2c2c2c',
    },
    button: {
        marginTop: 16,
        backgroundColor: '#d32f2f',
    },
});
