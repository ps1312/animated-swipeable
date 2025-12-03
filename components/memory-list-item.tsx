import Ionicons from '@expo/vector-icons/Ionicons'
import { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from 'react-native'

import { Memory } from '../memories'

interface MemoryListItemProps {
  item: Memory
  setIsSwiping: (state: boolean) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SNAP_THRESHOLD = -(SCREEN_WIDTH * 0.3)

const MemoryListItem = ({ item, setIsSwiping }: MemoryListItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsSwiping(isAnimating)
  }, [isAnimating])

  const translateX = useAnimatedValue(0)
  const lastDistance = useRef(0)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
      },
      onPanResponderGrant: () => {
        setIsAnimating(true)
      },
      onPanResponderMove: (_, gestureState) => {
        const totalDistance = gestureState.dx + lastDistance.current
        translateX.setValue(totalDistance)
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsAnimating(false)

        const totalDistance = gestureState.dx + lastDistance.current
        const endPosition = totalDistance > SNAP_THRESHOLD ? 0 : SNAP_THRESHOLD
        lastDistance.current = endPosition

        Animated.spring(translateX, {
          toValue: endPosition,
          useNativeDriver: true,
          bounciness: 0,
        }).start()
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current

  const deleteOpacity = translateX.interpolate({
    inputRange: [SNAP_THRESHOLD, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const deleteScale = translateX.interpolate({
    inputRange: [SNAP_THRESHOLD, 0],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  })

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.listItem,
          {
            transform: [{ translateX }],
            backgroundColor: isAnimating ? 'gray' : 'black',
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.listItemTitle}>{item.emotion}</Text>
          <Text style={styles.listItemDate}>
            {item.createdAt.toDateString()}
          </Text>
          <Text style={styles.listItemSubtitle}>{item.activity}</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.deleteContainer,
          { opacity: deleteOpacity, transform: [{ scale: deleteScale }] },
        ]}
      >
        <TouchableOpacity activeOpacity={0.6}>
          <Ionicons name="trash-outline" size={32} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 8, justifyContent: 'center' },
  listItem: {
    height: 90,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d0d0d0',
    zIndex: 1,
  },
  listItemTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  listItemSubtitle: { color: 'lightgray', fontSize: 16 },
  listItemDate: { color: 'lightgray', fontSize: 14, alignSelf: 'flex-end' },
  deleteContainer: {
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    backgroundColor: 'red',
    marginRight: 16,
    padding: 8,
    borderRadius: 32,
  },
})

export default MemoryListItem
