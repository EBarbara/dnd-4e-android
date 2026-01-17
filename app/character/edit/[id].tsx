import { View, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCharacterStore } from '../../../src/store/characterStore';
import { CharacterForm } from '../../../src/components/CharacterForm';
import { Title, Text } from 'react-native-paper';

export default function EditCharacterScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const character = useCharacterStore((state) =>
        state.characters.find(c => c.id === id)
    );
    const updateCharacter = useCharacterStore((state) => state.updateCharacter);

    if (!character) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Character not found</Text>
            </View>
        );
    }

    const handleUpdate = (values: any) => {
        updateCharacter(character.id, values);
        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Title style={styles.title}>Edit {character.name}</Title>
            <CharacterForm
                initialValues={character}
                onSubmit={handleUpdate}
                submitLabel="Save Changes"
                mode="edit"
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        marginBottom: 24,
        color: '#fff',
    },
    text: {
        color: '#fff',
    }
});
