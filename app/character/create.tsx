import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useCharacterStore } from '../../src/store/characterStore';
import { CharacterForm } from '../../src/components/CharacterForm';
import { Title } from 'react-native-paper';
import { globalStyles } from '../../src/styles/global.styles';
import { Character } from '../../src/types';

export default function CreateCharacterScreen() {
    const router = useRouter();
    const addCharacter = useCharacterStore((state) => state.addCharacter);

    const handleCreate = async (values: Partial<Character>) => {
        const newId = Date.now().toString();
        await addCharacter({ ...values, id: newId });
        router.replace(`/character/${newId}`);
    };

    return (
        <ScrollView style={globalStyles.container} contentContainerStyle={{ paddingBottom: 40 }}>
            <Title style={globalStyles.title}>Create New Character</Title>
            <CharacterForm
                onSubmit={handleCreate}
                submitLabel="Create Character"
                mode="create"
            />
        </ScrollView>
    );
}
