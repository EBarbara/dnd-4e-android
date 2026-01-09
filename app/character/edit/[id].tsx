import { View, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <Title style={styles.title}>Edit {character.name}</Title>
            <CharacterForm
                initialValues={character}
                onSubmit={handleUpdate}
                submitLabel="Save Changes"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#121212',
    },
    title: {
        marginBottom: 24,
        color: '#fff',
    },
    text: {
        color: '#fff',
    }
});
