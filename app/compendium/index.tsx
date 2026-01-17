import React from 'react';
import { View, FlatList } from 'react-native';
import { Card, Title, Text, TouchableRipple } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { globalStyles } from '../../src/styles/global.styles';
import { theme } from '../../src/styles/theme';

const categories = [
    { id: 'races', title: 'Races', description: 'Playable races of the D&D world.' },
    { id: 'classes', title: 'Classes', description: 'Heroic vocations and paths.' },
    { id: 'skills', title: 'Skills', description: 'Abilities and proficiencies.' },
    { id: 'feats', title: 'Feats', description: 'Special advantages and talents.' },
    { id: 'powers', title: 'Powers', description: 'Spells, exploits, and prayers.' },
];

export default function CompendiumScreen() {
    const router = useRouter();

    return (
        <View style={globalStyles.container}>
            <Stack.Screen options={{ title: 'Compendium' }} />
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                contentContainerStyle={globalStyles.list}
                renderItem={({ item }) => (
                    <Card style={globalStyles.card}>
                        <TouchableRipple onPress={() => router.push(`/compendium/${item.id}`)}>
                            <Card.Content>
                                <Title style={globalStyles.cardTitle}>{item.title}</Title>
                                <Text style={globalStyles.cardDetail}>{item.description}</Text>
                            </Card.Content>
                        </TouchableRipple>
                    </Card>
                )}
            />
        </View>
    );
}
