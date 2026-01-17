
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Paragraph, Button } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { DraftService } from '../../../src/services/draftService';

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
        <ScrollView style={styles.container}>
            <Title style={styles.title}>Phase 1: Choose Race</Title>
            <Paragraph style={styles.text}>
                Decide the race of your character. Your choice of race offers several racial advantages.
            </Paragraph>
            <Paragraph style={styles.placeholder}>
                [Race Selection UI will be implemented here]
            </Paragraph>

            <View style={styles.actions}>
                <Button mode="contained" onPress={handleNext} loading={loading} disabled={loading}>
                    Next: Choose Class
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
        justifyContent: 'flex-end',
    }
});
