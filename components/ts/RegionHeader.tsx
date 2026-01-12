import { View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Icon, Text } from '~/components/ui';

export const RegionHeader = ({
  title,
  isExpanded,
  onPress,
}: {
  title: string;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isExpanded ? '90deg' : '0deg', { duration: 200 }) }],
  }));
  return (
    <View className="mb-2 rounded-2xl bg-card">
      <Pressable className="flex-row items-center justify-between p-4" onPress={onPress}>
        <Text variant="heading">{5}</Text>
        <Text variant="heading">{title}</Text>

        <Animated.View style={animatedStyle}>
          <Icon name="arrow-right" />
        </Animated.View>
      </Pressable>
    </View>
  );
};
