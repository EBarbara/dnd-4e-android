import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';
// import { Stack } from 'expo-router'; // Duplicate import if I'm not careful, but I need Stack.Screen

import { Stack as ExpoStack } from 'expo-router';

import { useCompendiumStore } from '../../src/store/compendiumStore';

export default function RacesScreen() {
    const racesData = useCompendiumStore((state) => state.races);

    return (
        <View style={styles.container}>
            <ExpoStack.Screen options={{ title: 'Races' }} />
            <FlatList
                data={racesData}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>{item.name}</Title>
                            <Text style={styles.cardDetail}>{item.traits}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#1e1e1e',
        marginBottom: 16,
    },
    cardTitle: {
        color: '#fff',
    },
    cardDetail: {
        color: '#a0a0a0',
        marginTop: 4,
    },
});
