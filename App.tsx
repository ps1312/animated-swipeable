import { StatusBar } from 'expo-status-bar'
import { FlatList, StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import { useState } from 'react'
import MemoryListItem from './components/memory-list-item'
import memories from './memories'

const App = () => {
  const [isSwiping, setIsSwiping] = useState(false)

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <FlatList
          scrollEnabled={!isSwiping}
          data={memories}
          renderItem={({ item }) => (
            <MemoryListItem item={item} setIsSwiping={setIsSwiping} />
          )}
          contentContainerStyle={{ marginHorizontal: 16 }}
        />
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
