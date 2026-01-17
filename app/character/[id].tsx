import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { Text, Button, Title, Paragraph, Card } from 'react-native-paper';

export default function CharacterDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const character = useCharacterStore((state) =>
        state.characters.find(c => c.id === id)
    );
    const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);

    if (!character) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Character not found</Text>
            </View>
        );
    }

    const handleDelete = () => {
        deleteCharacter(character.id);
        router.replace('/');
    };

    return (
        <ScrollView style={styles.container}>
            <Title style={styles.title}>{character.name}</Title>
            <Paragraph style={styles.subtitle}>Level {character.level} {character.race} {character.class}</Paragraph>

            <View style={styles.cardContainer}>
                <Card style={styles.card}>
                    <Card.Title title="Attributes" titleStyle={styles.cardTitle} />
                    <Card.Content>
                        <View style={styles.statsGrid}>
                            {Object.entries(character.abilities).map(([key, value]) => (
                                <View key={key} style={styles.statBox}>
                                    <Text style={styles.statLabel}>{key.toUpperCase()}</Text>
                                    <Text style={styles.statValue}>{value}</Text>
                                </View>
                            ))}
                        </View>
                    </Card.Content>
                </Card>
            </View>

            {/* Update Header Title */}
            <Stack.Screen options={{ title: character.name || 'Character Details' }} />

            <View style={styles.actions}>
                <Button
                    mode="contained"
                    onPress={() => router.push(`/character/edit/${character.id}`)}
                    style={styles.editButton}
                >
                    Edit Character
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => router.replace('/')}
                    textColor="white"
                    style={{ borderColor: 'white' }}
                >
                    Back to List
                </Button>
                <Button
                    mode="outlined"
                    onPress={handleDelete}
                    style={styles.deleteButton}
                    textColor="#ef5350"
                >
                    Delete Character
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    title: {
        fontSize: 32,
        color: '#fff',
    },
    subtitle: {
        fontSize: 18,
        color: '#a0a0a0',
        marginBottom: 24,
    },
    text: {
        color: '#fff',
    },
    actions: {
        marginTop: 32,
        gap: 16,
        paddingBottom: 40,
    },
    editButton: {
        backgroundColor: '#1976d2',
    },
    deleteButton: {
        borderColor: '#ef5350',
    },
    cardContainer: {
        gap: 16,
    },
    card: {
        backgroundColor: '#1e1e1e',
    },
    cardTitle: {
        color: '#fff',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: '#2c2c2c',
        padding: 8,
        borderRadius: 8,
        minWidth: 50,
        flex: 1,
    },
    statLabel: {
        color: '#a0a0a0',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statValue: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
