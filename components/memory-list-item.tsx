import { useRef, useState } from 'react'
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  useAnimatedValue,
} from 'react-native'

import { Memory } from '../memories'

interface MemoryListItemProps {
  item: Memory
}

const MemoryListItem = ({ item }: MemoryListItemProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  const translateX = useAnimatedValue(0)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsAnimating(true)
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.setValue(gestureState.dx)
      },
      onPanResponderRelease: () => {
        setIsAnimating(false)
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start()
      },
    })
  ).current

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.listItem,
        {
          transform: [{ translateX }],
          backgroundColor: isAnimating ? 'gray' : 'transparent',
        },
      ]}
    >
      <Text style={styles.listItemTitle}>{item.emotion}</Text>
      <Text style={styles.listItemDate}>{item.createdAt.toDateString()}</Text>
      <Text style={styles.listItemSubtitle}>{item.activity}</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  listItem: {
    height: 90,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#d0d0d0',
    justifyContent: 'center',
    marginBottom: 8,
  },
  listItemTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
  listItemSubtitle: { color: 'lightgray', fontSize: 16 },
  listItemDate: { color: 'lightgray', fontSize: 14, alignSelf: 'flex-end' },
})

export default MemoryListItem
