import { StatusBar } from 'expo-status-bar'
import { FlatList, StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import MemoryListItem from './components/memory-list-item'
import memories from './memories'

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <FlatList
          data={memories}
          renderItem={({ item }) => <MemoryListItem item={item} />}
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
