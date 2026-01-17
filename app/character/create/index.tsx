
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Title, Button, Text } from 'react-native-paper';
import { useState, useCallback } from 'react';
import { DraftService } from '../../../src/services/draftService';

export default function CreateCharacterIndex() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [drafts, setDrafts] = useState<{ id: string; step: number; data: any }[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const loadDrafts = async () => {
        try {
            const result = await DraftService.getDrafts();
            setDrafts(result);
        } catch (error) {
            console.error('Failed to load drafts:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadDrafts();
        }, [])
    );

    const startNewCharacter = async () => {
        setIsLoading(true);
        try {
            const id = await DraftService.createDraft();
            router.push({ pathname: '/character/create/race', params: { draftId: id } });
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resumeDraft = (id: string, step: number) => {
        const routes = [
            'race',
            'class',
            'abilities',
            'skills',
            'feats',
            'powers',
            'equipment',
            'numbers',
            'details'
        ];
        // Ensure step is within bounds (1-9)
        const safeStep = Math.max(1, Math.min(step, 9));
        // Array is 0-indexed, so step 1 corresponds to index 0
        const routeName = routes[safeStep - 1];

        router.push({ pathname: `/character/create/${routeName}`, params: { draftId: id } });
    };

    const deleteDraft = async (id: string) => {
        try {
            await DraftService.deleteDraft(id);
            loadDrafts();
        } catch (error) {
            console.error('Failed to delete draft:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>Create New Character</Title>
            <Text style={styles.description}>
                Follow the 9 steps from the Player's Handbook to create your hero.
            </Text>

            <View style={styles.buttonContainer}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#d32f2f" />
                ) : (
                    <Button
                        mode="contained"
                        onPress={startNewCharacter}
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        icon="plus"
                    >
                        Start New Character
                    </Button>
                )}
            </View>

            {drafts.length > 0 && (
                <View style={styles.draftsContainer}>
                    <Title style={styles.draftsTitle}>Resume Draft</Title>
                    {drafts.map((draft) => (
                        <View key={draft.id} style={styles.draftItem}>
                            <View style={styles.draftInfo}>
                                <Text style={styles.draftName}>
                                    {draft.data.name !== 'New Hero' ? draft.data.name : 'Untitled Character'}
                                </Text>
                                <Text style={styles.draftDetails}>
                                    Phase {draft.step}: {draft.data.race} {draft.data.class}
                                </Text>
                            </View>
                            <View style={styles.draftActions}>
                                <Button
                                    mode="text"
                                    onPress={() => resumeDraft(draft.id, draft.step)}
                                    textColor="#4caf50"
                                >
                                    Resume
                                </Button>
                                <Button
                                    mode="text"
                                    onPress={() => deleteDraft(draft.id)}
                                    textColor="#ef5350"
                                    compact
                                >
                                    Delete
                                </Button>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        marginBottom: 16,
        fontSize: 28,
        marginTop: 40,
    },
    description: {
        color: '#ccc',
        textAlign: 'center',
        marginBottom: 30,
        fontSize: 16,
    },
    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#d32f2f',
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 18,
    },
    draftsContainer: {
        width: '100%',
        maxWidth: 400,
        flex: 1,
    },
    draftsTitle: {
        color: '#e0e0e0',
        fontSize: 20,
        marginBottom: 16,
        alignSelf: 'flex-start',
    },
    draftItem: {
        backgroundColor: '#1e1e1e',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    draftInfo: {
        flex: 1,
    },
    draftName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    draftDetails: {
        color: '#a0a0a0',
    },
    draftActions: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
