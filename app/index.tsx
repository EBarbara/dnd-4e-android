import { View, FlatList } from 'react-native';
import { Text, Button, Card, Title, Paragraph, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../src/store/characterStore';
import { useEffect } from 'react';
import { globalStyles } from '../src/styles/global.styles';
import { theme } from '../src/styles/theme';

export default function HomeScreen() {
    const router = useRouter();
    const { characters, fetchCharacters } = useCharacterStore();

    useEffect(() => {
        fetchCharacters();
    }, []);

    return (
        <View style={globalStyles.container}>
            <View style={globalStyles.headerContainer}>
                <Button
                    mode="outlined"
                    icon="book-open-variant"
                    onPress={() => router.push('/compendium')}
                    style={{ borderColor: theme.colors.subtext }}
                    textColor={theme.colors.text}
                >
                    Open Compendium
                </Button>
            </View>
            {characters.length === 0 ? (
                <View style={globalStyles.emptyState}>
                    <Text variant="headlineMedium" style={globalStyles.text}>No Characters Yet</Text>
                    <Text style={globalStyles.subtitle}>Your adventure begins here.</Text>
                    <Button
                        mode="contained"
                        onPress={() => router.push('/character/create')}
                        style={globalStyles.button}
                    >
                        Create New Character
                    </Button>
                </View>
            ) : (
                <FlatList
                    data={characters}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    renderItem={({ item }) => (
                        <Card style={globalStyles.card} onPress={() => router.push(`/character/${item.id}`)}>
                            <Card.Content>
                                <Title style={globalStyles.cardTitle}>{item.name}</Title>
                                <Paragraph style={globalStyles.cardSubtitle}>Lv {item.level} {item.race} {item.class}</Paragraph>
                            </Card.Content>
                        </Card>
                    )}
                />
            )}

            {characters.length > 0 && (
                <FAB
                    icon="plus"
                    style={globalStyles.fab}
                    onPress={() => router.push('/character/create')}
                    color="white"
                />
            )}
        </View>
    );
}
