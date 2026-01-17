import { View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { Text, Button, Title, Paragraph, Card } from 'react-native-paper';
import { globalStyles } from '../../src/styles/global.styles';
import { theme } from '../../src/styles/theme';

export default function CharacterDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const character = useCharacterStore((state) =>
        state.characters.find(c => c.id === id)
    );
    const deleteCharacter = useCharacterStore((state) => state.deleteCharacter);

    if (!character) {
        return (
            <View style={globalStyles.container}>
                <Text style={globalStyles.text}>Character not found</Text>
            </View>
        );
    }

    const handleDelete = () => {
        deleteCharacter(character.id);
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    return (
        <ScrollView style={globalStyles.container}>
            <Title style={globalStyles.title}>{character.name}</Title>
            <Paragraph style={globalStyles.subtitle}>Level {character.level} {character.race} {character.class}</Paragraph>

            <View style={{ gap: 16 }}>
                <Card style={globalStyles.card}>
                    <Card.Title title="Attributes" titleStyle={globalStyles.cardTitle} />
                    <Card.Content>
                        <View style={globalStyles.statsGrid}>
                            {Object.entries(character.abilities).map(([key, value]) => (
                                <View key={key} style={globalStyles.statBox}>
                                    <Text style={globalStyles.statLabel}>{key.toUpperCase()}</Text>
                                    <Text style={globalStyles.statValue}>{value}</Text>
                                </View>
                            ))}
                        </View>
                    </Card.Content>
                </Card>
            </View>

            {/* Update Header Title */}
            <Stack.Screen options={{ title: character.name || 'Character Details' }} />

            <View style={{ marginTop: 32, gap: 16, paddingBottom: 40 }}>
                <Button
                    mode="contained"
                    onPress={() => router.push(`/character/edit/${character.id}`)}
                    style={{ backgroundColor: '#1976d2' }}
                >
                    Edit Character
                </Button>
                <Button
                    mode="outlined"
                    onPress={() => {
                        if (router.canGoBack()) {
                            router.back();
                        } else {
                            router.replace('/');
                        }
                    }}
                    textColor="white"
                    style={{ borderColor: 'white' }}
                >
                    Back to List
                </Button>
                <Button
                    mode="outlined"
                    onPress={handleDelete}
                    style={{ borderColor: theme.colors.error }}
                    textColor={theme.colors.error}
                >
                    Delete Character
                </Button>
            </View>
        </ScrollView>
    );
}
