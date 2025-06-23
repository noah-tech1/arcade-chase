import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT * 0.7;

export default function App() {
  const [gameState, setGameState] = useState('ready'); // ready, playing, ended
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [player, setPlayer] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 100 });
  const [collectibles, setCollectibles] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [cheatMode, setCheatMode] = useState(false);
  
  const gameLoopRef = useRef();
  const lastSpawnRef = useRef(0);

  // Initialize game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setPlayer({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 100 });
    setCollectibles([]);
    setObstacles([]);
    gameLoop();
  };

  // Game loop
  const gameLoop = () => {
    const now = Date.now();
    
    // Spawn collectibles and obstacles
    if (now - lastSpawnRef.current > 2000) {
      spawnItems();
      lastSpawnRef.current = now;
    }
    
    // Update items
    updateItems();
    
    if (gameState === 'playing') {
      gameLoopRef.current = setTimeout(gameLoop, 50); // 20 FPS
    }
  };

  const spawnItems = () => {
    // Spawn collectible
    setCollectibles(prev => [...prev, {
      id: Math.random(),
      x: Math.random() * (GAME_WIDTH - 30),
      y: -20,
      type: 'collectible'
    }]);
    
    // Spawn obstacle
    setObstacles(prev => [...prev, {
      id: Math.random(),
      x: Math.random() * (GAME_WIDTH - 30),
      y: -20,
      type: 'obstacle'
    }]);
  };

  const updateItems = () => {
    // Move collectibles down
    setCollectibles(prev => prev
      .map(item => ({ ...item, y: item.y + 3 }))
      .filter(item => item.y < GAME_HEIGHT)
    );
    
    // Move obstacles down
    setObstacles(prev => prev
      .map(item => ({ ...item, y: item.y + 4 }))
      .filter(item => item.y < GAME_HEIGHT)
    );
    
    // Check collisions
    checkCollisions();
  };

  const checkCollisions = () => {
    // Check collectible collisions
    collectibles.forEach(collectible => {
      const distance = Math.sqrt(
        Math.pow(player.x - collectible.x, 2) + 
        Math.pow(player.y - collectible.y, 2)
      );
      
      if (distance < 25) {
        setScore(prev => prev + 10);
        setCollectibles(prev => prev.filter(item => item.id !== collectible.id));
      }
    });
    
    // Check obstacle collisions (skip if cheat mode)
    if (!cheatMode) {
      obstacles.forEach(obstacle => {
        const distance = Math.sqrt(
          Math.pow(player.x - obstacle.x, 2) + 
          Math.pow(player.y - obstacle.y, 2)
        );
        
        if (distance < 25) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameState('ended');
              clearTimeout(gameLoopRef.current);
            }
            return newLives;
          });
          setObstacles(prev => prev.filter(item => item.id !== obstacle.id));
        }
      });
    }
  };

  // Pan responder for touch controls
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (gameState === 'playing') {
        setPlayer(prev => ({
          x: Math.max(15, Math.min(GAME_WIDTH - 15, prev.x + gestureState.dx)),
          y: Math.max(15, Math.min(GAME_HEIGHT - 15, prev.y + gestureState.dy))
        }));
      }
    },
  });

  // Cheat code activation
  const activateCheatCode = () => {
    Alert.prompt(
      'Cheat Code',
      'Enter passcode:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (passcode) => {
            if (passcode === '7456660641') {
              setCheatMode(true);
              Alert.alert('Cheat Activated', 'God mode enabled!');
            } else {
              Alert.alert('Invalid Code', 'Incorrect passcode');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2C3E50" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Arcade Collector</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>Score: {score}</Text>
          <Text style={styles.statText}>Lives: {lives}</Text>
          {cheatMode && <Text style={styles.cheatText}>GOD MODE</Text>}
        </View>
      </View>

      <View style={styles.gameArea} {...panResponder.panHandlers}>
        {gameState === 'ready' && (
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>Arcade Collector</Text>
            <Text style={styles.instructions}>
              Drag to move your character{'\n'}
              Collect blue items{'\n'}
              Avoid red obstacles
            </Text>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>START GAME</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cheatButton} onPress={activateCheatCode}>
              <Text style={styles.cheatButtonText}>CHEAT CODE</Text>
            </TouchableOpacity>
          </View>
        )}

        {gameState === 'ended' && (
          <View style={styles.overlay}>
            <Text style={styles.overlayTitle}>Game Over</Text>
            <Text style={styles.finalScore}>Final Score: {score}</Text>
            <TouchableOpacity style={styles.button} onPress={startGame}>
              <Text style={styles.buttonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Player */}
        <View
          style={[
            styles.player,
            {
              left: player.x - 15,
              top: player.y - 15,
              backgroundColor: cheatMode ? '#FFD700' : '#00FFFF'
            }
          ]}
        />

        {/* Collectibles */}
        {collectibles.map(item => (
          <View
            key={item.id}
            style={[
              styles.collectible,
              { left: item.x, top: item.y }
            ]}
          />
        ))}

        {/* Obstacles */}
        {obstacles.map(item => (
          <View
            key={item.id}
            style={[
              styles.obstacle,
              { left: item.x, top: item.y }
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 10,
  },
  stats: {
    flexDirection: 'row',
    gap: 20,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cheatText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameArea: {
    flex: 1,
    backgroundColor: '#34495E',
    margin: 10,
    borderRadius: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  overlayTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00FFFF',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  finalScore: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#00FFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: '#2C3E50',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cheatButton: {
    backgroundColor: '#E74C3C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  cheatButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  player: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00FFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  collectible: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3498DB',
  },
  obstacle: {
    position: 'absolute',
    width: 25,
    height: 25,
    backgroundColor: '#E74C3C',
    transform: [{ rotate: '45deg' }],
  },
});