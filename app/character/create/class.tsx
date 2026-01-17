import { View, ScrollView } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { DraftService } from '../../../src/services/draftService';
import { globalStyles } from '../../../src/styles/global.styles';
import { theme } from '../../../src/styles/theme';

export default function ClassSelectionScreen() {
    const router = useRouter();
    const { draftId } = useLocalSearchParams<{ draftId: string }>();
    const [loading, setLoading] = useState(false);

    const handleNext = async () => {
        if (!draftId) return;
        setLoading(true);
        try {
            await DraftService.updateDraft(draftId, { class: 'Fighter' }, 3);
            router.push({ pathname: '/character/create/abilities', params: { draftId } });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={globalStyles.container}>
            <Title style={globalStyles.title}>Phase 2: Choose Class</Title>
            <Paragraph style={globalStyles.subtitle}>
                Your class represents your training or profession. Detailed in Chapter 4.
            </Paragraph>
            <Paragraph style={globalStyles.placeholder}>
                [Class Selection UI will be implemented here]
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
                    Next: Abilities
                </Button>
            </View>
        </ScrollView>
    );
}
