import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { CharacterForm } from '../../src/components/CharacterForm';
import { Title } from 'react-native-paper';

export default function CreateCharacterScreen() {
    const router = useRouter();
    const addCharacter = useCharacterStore((state) => state.addCharacter);

    const handleCreate = (values: any) => {
        addCharacter(values);
        router.back();
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <Title style={styles.title}>Create New Character</Title>
            <CharacterForm onSubmit={handleCreate} submitLabel="Create" mode="create" />
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
});
