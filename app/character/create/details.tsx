import { View, ScrollView } from 'react-native';
import { Title, Paragraph, Button, TextInput } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { DraftService } from '../../../src/services/draftService';
import { useCharacterStore } from '../../../src/store/characterStore';
import { globalStyles } from '../../../src/styles/global.styles';
import { theme } from '../../../src/styles/theme';

export default function DetailsScreen() {
    const router = useRouter();
    const { draftId } = useLocalSearchParams<{ draftId: string }>();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');

    const fetchCharacters = useCharacterStore((state) => state.fetchCharacters);

    const handleFinish = async () => {
        if (!draftId) return;
        setLoading(true);
        try {
            await DraftService.updateDraft(draftId, { name }, 9);
            await DraftService.saveCharacter(draftId);
            await fetchCharacters();

            router.dismissAll();
            router.replace('/');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={globalStyles.container}>
            <Title style={globalStyles.title}>Phase 9: Roleplaying Details</Title>
            <Paragraph style={globalStyles.subtitle}>
                Flesh out your character with details about your personality, appearance, and beliefs.
            </Paragraph>

            <TextInput
                label="Character Name"
                value={name}
                onChangeText={setName}
                style={globalStyles.input}
                mode="outlined"
            />

            <Paragraph style={globalStyles.placeholder}>
                [More RP Details UI will be implemented here]
            </Paragraph>

            <View style={globalStyles.actionsBetween}>
                <Button
                    mode="outlined"
                    onPress={() => router.back()}
                    textColor={theme.colors.subtext}
                    style={{ borderColor: theme.colors.subtext }}
                >
                    Back
                </Button>
                <Button
                    mode="contained"
                    onPress={handleFinish}
                    loading={loading}
                    disabled={loading || !name}
                    style={{ backgroundColor: theme.colors.success }}
                >
                    Finish Character
                </Button>
            </View>
        </ScrollView>
    );
}
