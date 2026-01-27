import { View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Icon, Text } from '~/components/ui';
import { cn } from '~/lib/cn';
import { computeRegionScore } from '~/lib/gameCalculations';
import { useTrackerStore } from '~/store';
import { Power, RegionId } from '~/store/types';

export const RegionHeader = ({
  title,
  regionId,
  isExpanded,
  onPress,
}: {
  title: string;
  regionId: RegionId;
  isExpanded: boolean;
  onPress: () => void;
}) => {
  const { regions, countries, regionsStatus } = useTrackerStore();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isExpanded ? '90deg' : '0deg', { duration: 200 }) }],
  }));

  const usaScore = computeRegionScore(regionId, Power.USA, regions, regionsStatus, countries);
  const urssScore = computeRegionScore(regionId, Power.URSS, regions, regionsStatus, countries);
  const scoreDiff = usaScore - urssScore;

  const displayScore = Math.abs(scoreDiff);
  const bgColor = scoreDiff > 0 ? 'bg-blue-500' : scoreDiff < 0 ? 'bg-red-500' : 'bg-transparent';

  return (
    <View className="mb-2 rounded-2xl bg-card">
      <Pressable className="flex-row items-center justify-between p-4" onPress={onPress}>
        <View className={cn('rounded-2xl px-3 py-1', bgColor)}>
          <Text variant="heading" className="text-foreground">
            {displayScore}
          </Text>
        </View>
        <Text variant="heading">{title}</Text>

        <Animated.View style={animatedStyle}>
          <Icon name="arrow-right" />
        </Animated.View>
      </Pressable>
    </View>
  );
};
