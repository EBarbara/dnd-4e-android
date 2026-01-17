import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { useCompendiumStore } from '../../src/store/compendiumStore';
import { Stack } from 'expo-router';

export default function RacesScreen() {
    const { races, fetchRaces } = useCompendiumStore();

    useEffect(() => {
        fetchRaces();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Races' }} />
            <FlatList
                data={races}
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
