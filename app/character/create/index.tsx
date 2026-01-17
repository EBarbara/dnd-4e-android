import { View, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Title, Button, Text } from 'react-native-paper';
import { useState, useCallback } from 'react';
import { DraftService } from '../../../src/services/draftService';
import { globalStyles } from '../../../src/styles/global.styles';
import { theme } from '../../../src/styles/theme';

export default function CreateCharacterIndex() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [drafts, setDrafts] = useState<{ id: string; step: number; data: any }[]>([]);

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
        const safeStep = Math.max(1, Math.min(step, 9));
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
        <ScrollView contentContainerStyle={globalStyles.container}>
            <Title style={[globalStyles.title, { marginTop: 40, textAlign: 'center' }]}>Create New Character</Title>
            <Text style={[globalStyles.subtitle, { textAlign: 'center' }]}>
                Follow the 9 steps from the Player's Handbook to create your hero.
            </Text>

            <View style={{ width: '100%', maxWidth: 300, marginBottom: 40, alignSelf: 'center' }}>
                {isLoading ? (
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                ) : (
                    <Button
                        mode="contained"
                        onPress={startNewCharacter}
                        style={globalStyles.button}
                        labelStyle={{ fontSize: 18 }}
                        icon="plus"
                    >
                        Start New Character
                    </Button>
                )}
            </View>

            {drafts.length > 0 && (
                <View style={{ width: '100%', maxWidth: 400, flex: 1, alignSelf: 'center' }}>
                    <Title style={[globalStyles.title, { fontSize: 20 }]}>Resume Draft</Title>
                    {drafts.map((draft) => (
                        <View key={draft.id} style={globalStyles.listItem}>
                            <View style={{ flex: 1 }}>
                                <Text style={globalStyles.listItemTitle}>
                                    {draft.data.name !== 'New Hero' ? draft.data.name : 'Untitled Character'}
                                </Text>
                                <Text style={globalStyles.listItemSubtitle}>
                                    Phase {draft.step}: {draft.data.race} {draft.data.class}
                                </Text>
                            </View>
                            <View style={globalStyles.row}>
                                <Button
                                    mode="text"
                                    onPress={() => resumeDraft(draft.id, draft.step)}
                                    textColor={theme.colors.success}
                                >
                                    Resume
                                </Button>
                                <Button
                                    mode="text"
                                    onPress={() => deleteDraft(draft.id)}
                                    textColor={theme.colors.error}
                                    compact
                                >
                                    Delete
                                </Button>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}
