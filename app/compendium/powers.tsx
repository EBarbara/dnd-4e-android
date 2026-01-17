import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useCompendiumStore } from '../../src/store/compendiumStore';
import { globalStyles } from '../../src/styles/global.styles';

export default function PowersScreen() {
    const { powers, fetchPowers } = useCompendiumStore();

    useEffect(() => {
        fetchPowers();
    }, []);

    return (
        <View style={globalStyles.container}>
            <Stack.Screen options={{ title: 'Powers' }} />
            <FlatList
                data={powers}
                keyExtractor={(item) => item.name}
                contentContainerStyle={globalStyles.list}
                renderItem={({ item }) => (
                    <Card style={globalStyles.card}>
                        <Card.Content>
                            <Title style={globalStyles.cardTitle}>{item.name}</Title>
                            <Text style={globalStyles.cardDetail}>Lv {item.level} {item.class} {item.type}</Text>
                            <Text style={globalStyles.cardDetail}>{item.action} - Range: {item.range}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}
