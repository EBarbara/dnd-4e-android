
import { Stack } from 'expo-router';

export default function CreateCharacterLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'New Character' }} />
            <Stack.Screen name="race" options={{ title: 'Phase 1: Choose Race' }} />
            <Stack.Screen name="class" options={{ title: 'Phase 2: Choose Class' }} />
            <Stack.Screen name="abilities" options={{ title: 'Phase 3: Ability Scores' }} />
            <Stack.Screen name="skills" options={{ title: 'Phase 4: Choose Skills' }} />
            <Stack.Screen name="feats" options={{ title: 'Phase 5: Select Feats' }} />
            <Stack.Screen name="powers" options={{ title: 'Phase 6: Choose Powers' }} />
            <Stack.Screen name="equipment" options={{ title: 'Phase 7: Equipment' }} />
            <Stack.Screen name="numbers" options={{ title: 'Phase 8: Numbers' }} />
            <Stack.Screen name="details" options={{ title: 'Phase 9: Details' }} />
        </Stack>
    );
}
