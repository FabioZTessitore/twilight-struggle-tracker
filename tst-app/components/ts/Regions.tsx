import { useData } from 'store/data';
import { FlatList, View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'white',
  },
});

export default function Regions() {
  const regions = useData((state) => state.regions);

  return (
    <View style={styles.container}>
      <Text>Regions here</Text>

      <FlatList
        data={[
          regions['Europe'],
          regions['Asia'],
          regions['ME'],
          regions['Africa'],
          regions['CA'],
          regions['SA'],
        ]}
        renderItem={({ item }) => (
          <Text key={item.name} style={styles.item}>
            {item.name}
          </Text>
        )}
      />
    </View>
  );
}
