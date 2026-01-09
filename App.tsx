import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>D&D 4E</Text>
        <Text style={styles.subtitle}>Character Manager</Text>
        <Text style={styles.status}>System Online</Text>
        <StatusBar style="auto" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark theme background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#e6e6e6',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subtitle: {
    color: '#b3b3b3',
    fontSize: 18,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  status: {
    color: '#4caf50',
    fontSize: 14,
    fontFamily: 'monospace',
  },
});
