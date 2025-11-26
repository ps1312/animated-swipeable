import { StatusBar } from 'expo-status-bar'
import { FlatList, ListRenderItem, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import memories, { Memory } from './memories'

const MemoryListItem: ListRenderItem<Memory> = ({ item }) => (
  <View style={styles.listItem}>
    <Text style={styles.listItemTitle}>{item.emotion}</Text>
    <Text style={styles.listItemDate}>{item.createdAt.toDateString()}</Text>
    <Text style={styles.listItemSubtitle}>{item.activity}</Text>
  </View>
)

const App = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />

        <FlatList
          data={memories}
          renderItem={MemoryListItem}
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

export default App
