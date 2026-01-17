
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Paragraph, Button, TextInput } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { DraftService } from '../../../src/services/draftService';
import { useCharacterStore } from '../../../src/store/characterStore';

export default function DetailsScreen() {
    const router = useRouter();
    const { draftId } = useLocalSearchParams<{ draftId: string }>();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    // We need to refresh the main list after saving
    const fetchCharacters = useCharacterStore((state) => state.fetchCharacters);

    const handleFinish = async () => {
        if (!draftId) return;
        setLoading(true);
        try {
            await DraftService.updateDraft(draftId, { name }, 9);
            await DraftService.saveCharacter(draftId);
            await fetchCharacters();

            // Navigate to home and then to the new character or just home?
            // For now, go to home
            router.dismissAll();
            router.replace('/');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.title}>Phase 9: Roleplaying Details</Title>
            <Paragraph style={styles.text}>
                Flesh out your character with details about your personality, appearance, and beliefs.
            </Paragraph>

            <TextInput
                label="Character Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                mode="outlined"
            />

            <Paragraph style={styles.placeholder}>
                [More RP Details UI will be implemented here]
            </Paragraph>

            <View style={styles.actions}>
                <Button mode="outlined" onPress={() => router.back()} style={styles.backButton}>
                    Back
                </Button>
                <Button
                    mode="contained"
                    onPress={handleFinish}
                    loading={loading}
                    disabled={loading || !name}
                    style={styles.finishButton}
                >
                    Finish Character
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 16,
    },
    title: {
        color: '#fff',
        marginBottom: 8,
    },
    text: {
        color: '#ccc',
        marginBottom: 16,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#2c2c2c',
    },
    placeholder: {
        color: '#666',
        fontStyle: 'italic',
        marginBottom: 32,
        padding: 20,
        backgroundColor: '#1e1e1e',
        textAlign: 'center',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    backButton: {
        borderColor: '#666',
    },
    finishButton: {
        backgroundColor: '#2e7d32',
    }
});
