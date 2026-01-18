import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Card, Title, Text, Paragraph, Divider, List } from 'react-native-paper';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useCompendiumStore } from '../../../src/store/compendiumStore';
import { globalStyles } from '../../../src/styles/global.styles';

export default function RaceDetailScreen() {
    const { id } = useLocalSearchParams();
    const { races } = useCompendiumStore();

    // We parse ID as string from search params, find matching race
    const race = races.find(r => r.id.toString() === id);

    if (!race) {
        return (
            <View style={globalStyles.container}>
                <Stack.Screen options={{ title: 'Race Not Found' }} />
                <Text style={{ padding: 20 }}>Race not found.</Text>
            </View>
        );
    }

    return (
        <View style={globalStyles.container}>
            <Stack.Screen options={{ title: race.name }} />
            <ScrollView contentContainerStyle={globalStyles.scrollContent}>

                <Card style={[globalStyles.card, { marginBottom: 16 }]}>
                    <Card.Content>
                        <Title style={globalStyles.cardTitle}>{race.name}</Title>
                        {!!race.quote && (
                            <Paragraph style={{ fontStyle: 'italic', marginBottom: 10 }}>"{race.quote}"</Paragraph>
                        )}
                        <Text style={globalStyles.cardDetail}>{race.description}</Text>
                    </Card.Content>
                </Card>

                <Card style={[globalStyles.card, { marginBottom: 16 }]}>
                    <Card.Title title="Traits & Features" />
                    <Card.Content>
                        <Title style={{ fontSize: 16, marginTop: 10 }}>Ability Scores</Title>
                        <Paragraph>{race.ability_scores}</Paragraph>

                        <Title style={{ fontSize: 16, marginTop: 10 }}>Size</Title>
                        <Paragraph>{race.size}</Paragraph>

                        <Title style={{ fontSize: 16, marginTop: 10 }}>Speed</Title>
                        <Paragraph>{race.speed}</Paragraph>

                        <Title style={{ fontSize: 16, marginTop: 10 }}>Vision</Title>
                        <Paragraph>{race.vision}</Paragraph>

                        <Title style={{ fontSize: 16, marginTop: 10 }}>Languages</Title>
                        <Paragraph>{race.languages}</Paragraph>

                        <Title style={{ fontSize: 16, marginTop: 10 }}>Defense Bonuses</Title>
                        <Paragraph>{race.defense_bonuses}</Paragraph>
                    </Card.Content>
                </Card>

                {race.traits && race.traits.length > 0 && (
                    <Card style={globalStyles.card}>
                        <Card.Title title="Racial Traits" />
                        <Card.Content>
                            {race.traits.map((trait, index) => (
                                <View key={index} style={{ marginBottom: 8 }}>
                                    <Text style={{ fontSize: 14 }}>• {trait}</Text>
                                </View>
                            ))}
                        </Card.Content>
                    </Card>
                )}
            </ScrollView>
        </View>
    );
}
