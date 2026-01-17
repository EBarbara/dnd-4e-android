import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text } from 'react-native-paper';
import { Stack } from 'expo-router';

import { useCompendiumStore } from '../../src/store/compendiumStore';

export default function ClassesScreen() {
    const classesData = useCompendiumStore((state) => state.classes);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: 'Classes' }} />
            <FlatList
                data={classesData}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Title style={styles.cardTitle}>{item.name}</Title>
                            <Text style={styles.cardDetail}>{item.role} - {item.source}</Text>
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
