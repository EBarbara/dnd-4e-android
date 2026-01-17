import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { useCompendiumStore } from '../../src/store/compendiumStore';
import { Stack } from 'expo-router';
import { globalStyles } from '../../src/styles/global.styles';

export default function RacesScreen() {
    const { races, fetchRaces } = useCompendiumStore();

    useEffect(() => {
        fetchRaces();
    }, []);

    return (
        <View style={globalStyles.container}>
            <Stack.Screen options={{ title: 'Races' }} />
            <FlatList
                data={races}
                keyExtractor={(item) => item.name}
                contentContainerStyle={globalStyles.list}
                renderItem={({ item }) => (
                    <Card style={globalStyles.card}>
                        <Card.Content>
                            <Title style={globalStyles.cardTitle}>{item.name}</Title>
                            <Text style={globalStyles.cardDetail}>{item.traits}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}
