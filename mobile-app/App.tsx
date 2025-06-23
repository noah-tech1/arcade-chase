import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GameCanvas from './src/components/GameCanvas';
import { useGame } from './src/lib/stores/useGame';

export default function App() {
  const { phase } = useGame();

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" backgroundColor="#2C3E50" />
        
        <View style={styles.gameContainer}>
          <Text style={styles.title}>Arcade Collector</Text>
          
          {phase === "ready" && (
            <View style={styles.startScreen}>
              <Text style={styles.instructions}>
                Swipe to move your character{'\n'}
                Collect blue items{'\n'}
                Avoid red obstacles
              </Text>
            </View>
          )}
          
          <GameCanvas />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  startScreen: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
});