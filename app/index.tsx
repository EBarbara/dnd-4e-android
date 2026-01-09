import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Button, Card, Title, Paragraph, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';

export default function HomeScreen() {
    const router = useRouter();
    const characters = useCharacterStore((state) => state.characters);

    return (
        <View style={styles.container}>
            {characters.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text variant="headlineMedium" style={styles.text}>No Characters Yet</Text>
                    <Text style={styles.subtext}>Your adventure begins here.</Text>
                    <Button
                        mode="contained"
                        onPress={() => router.push('/character/create')}
                        style={styles.button}
                    >
                        Create New Character
                    </Button>
                </View>
            ) : (
                <FlatList
                    data={characters}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => (
                        <Card style={styles.card} onPress={() => router.push(`/character/${item.id}`)}>
                            <Card.Content>
                                <Title style={styles.cardTitle}>{item.name}</Title>
                                <Paragraph style={styles.cardSubtitle}>Lv {item.level} {item.race} {item.class}</Paragraph>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}

            {characters.length > 0 && (
                <FAB
                    icon="plus"
                    style={styles.fab}
                    onPress={() => router.push('/character/create')}
                    color="white"
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    text: {
        color: '#e0e0e0',
    },
    subtext: {
        color: '#a0a0a0',
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#d32f2f',
    },
    list: {
        padding: 16,
        paddingBottom: 80, // Space for FAB
    },
    card: {
        backgroundColor: '#1e1e1e',
        marginBottom: 16,
    },
    cardTitle: {
        color: '#fff',
    },
    cardSubtitle: {
        color: '#a0a0a0',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#d32f2f',
    },
});
