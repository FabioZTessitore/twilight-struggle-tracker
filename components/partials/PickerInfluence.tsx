import Animated, {
  FadeOut,
  SharedValue,
  StretchInX,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { View } from 'react-native';
import { Text } from '~/components/ui';
import { cn } from '~/lib/cn';
import { ClassValue } from 'class-variance-authority/types';
import { useMemo } from 'react';

interface PickerInfluenceProps {
  min: number;
  max: number;
  selected: number;
  translateX: SharedValue<number>;
  className?: ClassValue;
}

export const PickerInfluence = ({
  min,
  max,
  selected,
  translateX,
  className,
}: PickerInfluenceProps) => {
  const numbers = useMemo(() => Array.from({ length: 10 - 0 + 1 }, (_, i) => min + i), [min, max]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View
      entering={StretchInX.duration(250).withInitialValues({ transform: [{ scaleX: 0.6 }] })}
      exiting={FadeOut.duration(250)}
      className={cn(
        'h-10 w-20 flex-row items-center justify-center overflow-hidden rounded-2xl border border-border',
        className
      )}>
      <Animated.View className="flex-row" style={animatedStyle}>
        {numbers.map((n) => (
          <View key={n} className="w-8 items-center justify-center">
            <Text
              variant={n === selected ? 'heading' : 'body'}
              className={n === selected ? `text-foreground` : 'text-gray-600'}>
              {n}
            </Text>
          </View>
        ))}
      </Animated.View>
    </Animated.View>
  );
};
