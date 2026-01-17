import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, TouchableRipple } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';

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
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Compendium' }} />
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <TouchableRipple onPress={() => router.push(`/compendium/${item.id}`)}>
                            <Card.Content>
                                <Title style={styles.cardTitle}>{item.title}</Title>
                                <Text style={styles.cardDescription}>{item.description}</Text>
                            </Card.Content>
                        </TouchableRipple>
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
    cardDescription: {
        color: '#a0a0a0',
        marginTop: 4,
    },
});
