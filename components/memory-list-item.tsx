import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import { useEffect, useRef, useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  LayoutChangeEvent,
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

// animation constraints
const { width: SCREEN_WIDTH } = Dimensions.get('window')
const SNAP_OPEN = -(SCREEN_WIDTH * 0.25) // Show delete button
const SNAP_DELETE = -(SCREEN_WIDTH * 0.65) // Trigger delete action
const DELETE_ICON_SIZE = 28
const DELETE_BUTTON_PADDING = 8
const DELETE_BUTTON_WIDTH = DELETE_ICON_SIZE + DELETE_BUTTON_PADDING * 2

const MemoryListItem = ({
  item,
  setIsSwiping,
  onDelete,
}: MemoryListItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasCalcHeight, setHasCalcHeight] = useState(false)

  useEffect(() => {
    setIsSwiping(isAnimating)
  }, [isAnimating])

  const translateX = useAnimatedValue(0)
  const deleteWidthAnim = useAnimatedValue(DELETE_BUTTON_WIDTH)
  const heightAnim = useAnimatedValue(0)
  const lastPosition = useRef(0)
  const hasTriggeredHaptic = useRef(false)

  const animTranslateX = (position: number) => {
    Animated.spring(translateX, {
      toValue: position,
      useNativeDriver: false,
      bounciness: 0,
    }).start()
    lastPosition.current = position
  }

  const animDeleteWidth = (position: number) =>
    Animated.spring(deleteWidthAnim, {
      toValue: position,
      useNativeDriver: false,
      bounciness: 0,
    }).start()

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

        if (totalDistance < SNAP_DELETE && !hasTriggeredHaptic.current) {
          animDeleteWidth(SCREEN_WIDTH - DELETE_BUTTON_WIDTH - 20)
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          hasTriggeredHaptic.current = true
        } else if (totalDistance > SNAP_DELETE) {
          animDeleteWidth(DELETE_BUTTON_WIDTH)
          hasTriggeredHaptic.current = false
        }
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

        animTranslateX(endPosition)
      },
      onPanResponderTerminationRequest: () => false,
    })
  ).current

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout

    if (!hasCalcHeight) {
      heightAnim.setValue(height)
      setHasCalcHeight(true)
    }
  }

  const onCancelDelete = () => {
    animDeleteWidth(DELETE_BUTTON_WIDTH)
    animTranslateX(0)
  }

  const onConfirmDelete = () => {
    Animated.timing(heightAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start((finished) => {
      if (finished) onDelete(item.id)
    })
  }

  const handleDelete = () => {
    Alert.alert('Delete memory', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel', onPress: onCancelDelete },
      { text: 'Delete', onPress: onConfirmDelete },
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
    <Animated.View
      onLayout={handleLayout}
      style={[
        styles.container,
        { height: hasCalcHeight ? heightAnim : undefined },
      ]}
    >
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
          {
            opacity: deleteOpacity,
            transform: [{ scale: deleteScale }],
            width: deleteWidthAnim,
            height: heightAnim,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={handleDelete}
          style={styles.deleteButton}
        >
          <Ionicons
            name="trash-outline"
            size={DELETE_ICON_SIZE}
            color="white"
          />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: { justifyContent: 'center' },
  listItem: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    zIndex: 1,
    borderRadius: 16,
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
  deleteButton: {
    alignItems: 'center',
    backgroundColor: 'red',
    padding: DELETE_BUTTON_PADDING,
    borderRadius: 32,
  },
})

export default MemoryListItem
