import Ionicons from '@expo/vector-icons/Ionicons'
import { useEffect, useRef, useState } from 'react'
import {
  Alert,
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
  onDelete: (id: number) => void
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SNAP_OPEN = -(SCREEN_WIDTH * 0.3) // Show delete button
const SNAP_DELETE = -(SCREEN_WIDTH * 0.65) // Show delete button

const MemoryListItem = ({
  item,
  setIsSwiping,
  onDelete,
}: MemoryListItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsSwiping(isAnimating)
  }, [isAnimating])

  const translateX = useAnimatedValue(0)
  const lastPosition = useRef(0)

  const animateTo = (position: number) => {
    Animated.spring(translateX, {
      toValue: position,
      useNativeDriver: true,
      bounciness: 0,
    }).start()
    lastPosition.current = position
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
      },
      onPanResponderGrant: () => {
        setIsAnimating(true)
      },
      onPanResponderMove: (_, gestureState) => {
        const totalDistance = gestureState.dx + lastPosition.current
        translateX.setValue(totalDistance)
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsAnimating(false)
        const totalDistance = gestureState.dx + lastPosition.current

        let endPosition
        if (totalDistance < SNAP_DELETE) {
          endPosition = -SCREEN_WIDTH
          handleDelete()
        } else if (totalDistance < SNAP_OPEN) {
          endPosition = SNAP_OPEN
        } else {
          endPosition = 0
        }

        animateTo(endPosition)
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current

  const handleDelete = () => {
    Alert.alert('Delete memory', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel', onPress: () => animateTo(0) },
      { text: 'Delete', onPress: () => onDelete(item.id) },
    ])
  }

  const deleteOpacity = translateX.interpolate({
    inputRange: [SNAP_OPEN, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  const deleteScale = translateX.interpolate({
    inputRange: [SNAP_OPEN, 0],
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
        <View style={styles.listItemTitle}>
          <Text style={styles.listItemTitleText}>{item.emotion}</Text>
          <Text style={styles.listItemDate}>
            {item.createdAt.toDateString()}
          </Text>
        </View>

        <Text style={styles.listItemSubtitle}>{item.activity}</Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.deleteContainer,
          { opacity: deleteOpacity, transform: [{ scale: deleteScale }] },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    justifyContent: 'center',
  },
  listItem: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d0d0d0',
    zIndex: 1,
  },
  listItemTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItemTitleText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  listItemSubtitle: { color: 'lightgray', fontSize: 16 },
  listItemDate: { color: 'lightgray', fontSize: 14 },
  deleteContainer: {
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    marginRight: 16,
  },
  deleteButton: { backgroundColor: 'red', padding: 8, borderRadius: 32 },
})

export default MemoryListItem
