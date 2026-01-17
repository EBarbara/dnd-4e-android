import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useCompendiumStore } from '../src/store/compendiumStore';

const theme = {
    ...MD3DarkTheme,
    colors: {
        ...MD3DarkTheme.colors,
        primary: '#d32f2f', // D&D Red
        background: '#121212',
    },
};

export default function RootLayout() {
    const initializeCompendium = useCompendiumStore((state) => state.initialize);

    useEffect(() => {
        initializeCompendium();
    }, []);

    return (
        <PaperProvider theme={theme}>
            <Stack
                screenOptions={{
                    headerStyle: { backgroundColor: '#1f1f1f' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen name="index" options={{ title: 'Home' }} />
            </Stack>
            <StatusBar style="light" />
        </PaperProvider>
    );
}
