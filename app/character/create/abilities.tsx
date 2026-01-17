
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { DraftService } from '../../../src/services/draftService';

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
        <ScrollView style={styles.container}>
            <Title style={styles.title}>Phase 3: Ability Scores</Title>
            <Paragraph style={styles.text}>
                Generate your ability scores. Your race adjusts the scores you generate. Detailed in Chapter 2.
            </Paragraph>
            <Paragraph style={styles.placeholder}>
                [Ability Score Calculator UI will be implemented here]
            </Paragraph>

            <View style={styles.actions}>
                <Button mode="outlined" onPress={() => router.back()} style={styles.backButton}>
                    Back
                </Button>
                <Button mode="contained" onPress={handleNext} loading={loading} disabled={loading}>
                    Next: Skills
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
    }
});
