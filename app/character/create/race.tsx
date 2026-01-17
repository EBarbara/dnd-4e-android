import { View, ScrollView } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { DraftService } from '../../../src/services/draftService';
import { globalStyles } from '../../../src/styles/global.styles';

export default function RaceSelectionScreen() {
    const router = useRouter();
    const { draftId } = useLocalSearchParams<{ draftId: string }>();
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (!draftId) return;
        setLoading(true);
        try {
            // Placeholder: Save logic would go here
            await DraftService.updateDraft(draftId, { race: 'Human' }, 2);
            router.push({ pathname: '/character/create/class', params: { draftId } });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={globalStyles.container}>
            <Title style={globalStyles.title}>Phase 1: Choose Race</Title>
            <Paragraph style={globalStyles.subtitle}>
                Decide the race of your character. Your choice of race offers several racial advantages.
            </Paragraph>
            <Paragraph style={globalStyles.placeholder}>
                [Race Selection UI will be implemented here]
            </Paragraph>

            <View style={globalStyles.actions}>
                <Button mode="contained" onPress={handleNext} loading={loading} disabled={loading}>
                    Next: Choose Class
                </Button>
            </View>
        </ScrollView>
    );
}
