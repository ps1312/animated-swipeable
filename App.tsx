import { StatusBar } from 'expo-status-bar'
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import memories, { Memory } from './memories'

const MemoryListItem: ListRenderItem<Memory> = ({ item }) => (
  <View style={styles.listItem}>
    <Text style={styles.listItemTitle}>{item.emotion}</Text>
    <Text style={styles.listItemSubtitle}>{item.activity}</Text>
  </View>
)

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <FlatList data={memories} renderItem={MemoryListItem} />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  listItem: {
    height: 80,
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
})

export default App
