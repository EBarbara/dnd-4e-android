import React, { useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { Stack } from 'expo-router';
import { useCompendiumStore } from '../../src/store/compendiumStore';
import { globalStyles } from '../../src/styles/global.styles';

export default function FeatsScreen() {
    const { feats, fetchFeats } = useCompendiumStore();

    useEffect(() => {
        fetchFeats();
    }, []);

    return (
        <View style={globalStyles.container}>
            <Stack.Screen options={{ title: 'Feats' }} />
            <FlatList
                data={feats}
                keyExtractor={(item) => item.name}
                contentContainerStyle={globalStyles.list}
                renderItem={({ item }) => (
                    <Card style={globalStyles.card}>
                        <Card.Content>
                            <Title style={globalStyles.cardTitle}>{item.name}</Title>
                            <Text style={globalStyles.cardDetail}>{item.tier} Tier</Text>
                            <Text style={globalStyles.cardDetail}>Prereq: {item.prerequisite}</Text>
                            <Text style={globalStyles.cardDetail}>{item.benefit}</Text>
                        </Card.Content>
                    </Card>
                )}
            />
        </View>
    );
}
