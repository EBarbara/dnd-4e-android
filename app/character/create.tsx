import { View, StyleSheet } from 'react-native';
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
        <View style={styles.container}>
            <Title style={styles.title}>Create New Character</Title>
            <CharacterForm onSubmit={handleCreate} submitLabel="Create" />
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
});
