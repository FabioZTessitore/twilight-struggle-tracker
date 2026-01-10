import React, { useState, useEffect, useMemo } from 'react';
import { View, Pressable, Dimensions } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Text } from '~/components/ui';
import { cn } from '~/lib/cn';
import * as Haptic from 'expo-haptics';
import { ClassValue } from 'class-variance-authority/types';

interface PickerProps {
  min: number;
  max: number;
  value?: number;
  className?: ClassValue;
  onChange: (n: number) => void;
}

export const PickerInfluence = ({ min, max, value = min, className, onChange }: PickerProps) => {
  const [selected, setSelected] = useState(value);

  const step = 32;
  const RANGE = 1; // [prev current next]

  const [baseValue, setBaseValue] = useState(value);
  const translateX = useSharedValue(0);
  const dragX = useSharedValue(0);

  const DRAG_RATIO = 0.05; // 0.25–0.4 range sano

  const numbers = useMemo(() => {
    const out: number[] = [];
    for (let i = baseValue - RANGE; i <= baseValue + RANGE; i++) {
      if (i >= min && i <= max) out.push(i);
    }
    return out;
  }, [baseValue, min, max]);
  // Gestione del drag
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      dragX.set((value) => value + e.velocityX * DRAG_RATIO);

      if (dragX.value <= -step && baseValue < max) {
        dragX.set((value) => value + step);

        setBaseValue((v) => v + 1);
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
      }

      if (dragX.value >= step && baseValue > min) {
        dragX.set((value) => value - step);
        setBaseValue((v) => v - 1);

        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
      }
    })
    .onEnd(() => {
      dragX.set(withSpring(0));
      onChange(baseValue);
    })
    .runOnJS(true);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: dragX.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <View
        className={cn(
          'h-10 w-20 flex-row items-center justify-center overflow-hidden rounded-2xl border border-border',
          className
        )}>
        <Animated.View className="flex-row" style={animatedStyle}>
          {numbers.map((n) => (
            <View key={n} className="w-8 items-center justify-center ">
              <Text
                variant={n === baseValue ? 'body' : 'body'}
                className={n === baseValue ? `text-foreground` : 'text-gray-600'}>
                {n}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </GestureDetector>
  );
};
