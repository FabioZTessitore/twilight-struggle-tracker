import React, { useState, useEffect } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Text } from '~/components/ui';
import { cn } from '~/lib/cn';
import * as Haptic from 'expo-haptics';

interface PickerProps {
  min: number;
  max: number;
  value?: number;
  color?: string;
  onChange: (n: number) => void;
}

export const PickerInfluence = ({ min, max, value = min, color, onChange }: PickerProps) => {
  const [selected, setSelected] = useState(value);

  const numbers = [];
  for (let i = min; i <= max; i++) numbers.push(i);

  const CENTER = Math.floor((max - min) / 2) + min;
  const step = 32;

  const MIN_TRANSLATE = (CENTER - max) * step;
  const MAX_TRANSLATE = (CENTER - min) * step;

  const translateX = useSharedValue((CENTER - selected) * step);
  const lastStep = useSharedValue<number | null>(null);

  // Gestione del drag
  const gesture = Gesture.Pan()
    .onStart(() => {
      translateX.set((CENTER - selected) * step);
      lastStep.set(selected);
    })
    .onUpdate((e) => {
      const next = (CENTER - selected) * step + e.translationX;
      translateX.set(Math.max(MIN_TRANSLATE, Math.min(MAX_TRANSLATE, next)));

      const offset = Math.round(translateX.value / step);
      const nextNumber = CENTER - offset;

      // quando cambia numero
      if (nextNumber !== lastStep.value) {
        lastStep.set(nextNumber);
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
      }
    })
    .onEnd(() => {
      const offset = Math.round(translateX.value / step);
      const nextNumber = CENTER - offset;

      setSelected(nextNumber);
      onChange(nextNumber);

      translateX.set(withSpring((CENTER - nextNumber) * step));
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View
        className={cn(
          'h-10 w-20 flex-row items-center justify-center overflow-hidden rounded-2xl border border-border',
          `bg-${color}`
        )}>
        <Animated.View className="flex-row" style={animatedStyle}>
          {numbers.map((n) => (
            <View key={n} className="w-8 items-center justify-center ">
              <Text
                variant={n === selected ? 'heading' : 'body'}
                className={n === selected ? `text-foreground` : 'text-gray-600'}>
                {n}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
