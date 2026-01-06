import { View } from 'react-native';
import { Text } from '~/components/ui';

import Regions from '~/components/ts/Regions';

export default function TabOneScreen() {
  return (
    <View className="flex h-full items-center justify-center">
      <Text>Tab One</Text>
      <Regions />
    </View>
  );
}
