import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const NuclearStressTest = ({ children }: { children: React.ReactNode }) => {
  const [stressLevel, setStressLevel] = useState<
    'off' | 'mild' | 'hot' | 'nuclear'
  >('off')
  const [particleCount, setParticleCount] = useState(0)
  const particles = useRef<Animated.Value[]>([])

  useEffect(() => {
    if (stressLevel === 'off') {
      particles.current = []
      return
    }

    const config = {
      mild: { workers: 2, particles: 20, computeMs: 5 },
      hot: { workers: 5, particles: 50, computeMs: 15 },
      nuclear: { workers: 10, particles: 200, computeMs: 30 },
    }[stressLevel]

    // 🔥 Spawn animated particles everywhere
    particles.current = Array.from(
      { length: config.particles },
      () => new Animated.Value(0)
    )

    particles.current.forEach((particle, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle, {
            toValue: 1,
            duration: 500 + Math.random() * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(particle, {
            toValue: 0,
            duration: 500 + Math.random() * 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    })

    setParticleCount(config.particles)

    // 🔥 CPU burner - multiple workers doing heavy math
    const workers: NodeJS.Timeout[] = []

    for (let w = 0; w < config.workers; w++) {
      const worker = setInterval(() => {
        const start = Date.now()

        // Heavy computation cocktail
        while (Date.now() - start < config.computeMs) {
          // Prime number checking (CPU intensive)
          let num = Math.floor(Math.random() * 10000)
          for (let i = 2; i < num / 2; i++) {
            if (num % i === 0) break
          }

          // String operations (memory intensive)
          let str = 'stress'.repeat(100)
          str.split('').reverse().join('')

          // Array operations
          const arr = Array.from({ length: 100 }, () => Math.random())
          arr
            .sort()
            .reverse()
            .map((x) => x * x)

          // Object creation (GC stress)
          const obj = { a: 1, b: 2, c: 3, d: 4, e: 5 }
          JSON.stringify(obj)
          JSON.parse(JSON.stringify(obj))
        }
      }, 8) // Faster than 16ms frame time

      workers.push(worker)
    }

    // 🔥 Force layout recalculations
    const layoutThrashing = setInterval(() => {
      // This would normally cause layout thrashing
      // (React Native handles this better than web, but still adds overhead)
      setParticleCount((prev) => prev + Math.random() - 0.5)
    }, 100)
    workers.push(layoutThrashing)

    return () => {
      workers.forEach((w) => clearInterval(w))
      particles.current = []
    }
  }, [stressLevel])

  const buttonColors = {
    off: '#4CAF50',
    mild: '#FF9800',
    hot: '#FF5722',
    nuclear: '#F44336',
  }

  const buttonLabels = {
    off: '😴 No Stress',
    mild: '🔥 Mild Heat',
    hot: '🔥🔥 Hot AF',
    nuclear: '☢️ NUCLEAR',
  }

  const cycleStress = () => {
    const levels: Array<'off' | 'mild' | 'hot' | 'nuclear'> = [
      'off',
      'mild',
      'hot',
      'nuclear',
    ]
    const currentIndex = levels.indexOf(stressLevel)
    setStressLevel(levels[(currentIndex + 1) % levels.length])
  }

  return (
    <View style={styles.stressContainer}>
      <View style={styles.stressHeader}>
        <TouchableOpacity
          style={[
            styles.stressButton,
            { backgroundColor: buttonColors[stressLevel] },
          ]}
          onPress={cycleStress}
        >
          <Text style={styles.stressButtonText}>
            {buttonLabels[stressLevel]}
          </Text>
        </TouchableOpacity>

        {stressLevel !== 'off' && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              🔥 Active Workers:{' '}
              {stressLevel === 'mild' ? 2 : stressLevel === 'hot' ? 5 : 10}
            </Text>
            <Text style={styles.statsText}>
              💫 Particles: {Math.floor(particleCount)}
            </Text>
          </View>
        )}
      </View>

      {/* Animated particles overlay */}
      {stressLevel !== 'off' && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {particles.current.map((particle, i) => (
            <Animated.View
              key={i}
              style={{
                position: 'absolute',
                left: `${(i * 7) % 100}%`,
                top: `${(i * 13) % 100}%`,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor:
                  stressLevel === 'nuclear' ? '#FF0000' : '#FFA500',
                opacity: particle.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 1],
                }),
                transform: [
                  {
                    scale: particle.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.5],
                    }),
                  },
                ],
              }}
            />
          ))}
        </View>
      )}

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  stressContainer: {
    flex: 1,
  },
  stressHeader: {
    padding: 16,
    backgroundColor: '#000',
  },
  stressButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  stressButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
  },
  statsText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'monospace',
  },
})

export default NuclearStressTest
