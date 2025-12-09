import { StatusBar } from 'expo-status-bar'
import { FlatList, StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { useState } from 'react'
import MemoryListItem from './components/memory-list-item'
import NuclearStressTest from './components/nuclear-stress-test'
import data from './memories'

const App = () => {
  const [memories, setMemories] = useState(data)
  const [isSwiping, setIsSwiping] = useState(false)

  const handleDelete = (id: number) => {
    setMemories((prevMemories) => prevMemories.filter((m) => m.id !== id))
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <NuclearStressTest>
          <FlatList
            scrollEnabled={!isSwiping}
            data={memories}
            renderItem={({ item }) => (
              <MemoryListItem
                item={item}
                setIsSwiping={setIsSwiping}
                onDelete={handleDelete}
              />
            )}
            contentContainerStyle={{ marginHorizontal: 16 }}
          />
        </NuclearStressTest>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
})

export default App
