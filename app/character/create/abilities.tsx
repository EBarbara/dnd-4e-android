import { View, ScrollView } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { DraftService } from '../../../src/services/draftService';
import { globalStyles } from '../../../src/styles/global.styles';
import { theme } from '../../../src/styles/theme';

export default function AbilityScoresScreen() {
    const router = useRouter();
    const { draftId } = useLocalSearchParams<{ draftId: string }>();
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (!draftId) return;
        setLoading(true);
        try {
            await DraftService.updateDraft(draftId, {}, 4);
            router.push({ pathname: '/character/create/skills', params: { draftId } });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={globalStyles.container}>
            <Title style={globalStyles.title}>Phase 3: Ability Scores</Title>
            <Paragraph style={globalStyles.subtitle}>
                Generate your ability scores. Your race adjusts the scores you generate. Detailed in Chapter 2.
            </Paragraph>
            <Paragraph style={globalStyles.placeholder}>
                [Ability Score Calculator UI will be implemented here]
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
                <Button mode="contained" onPress={handleNext} loading={loading} disabled={loading}>
                    Next: Skills
                </Button>
            </View>
        </ScrollView>
    );
}
