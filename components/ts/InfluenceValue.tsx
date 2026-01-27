import { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, withSpring, FadeIn } from 'react-native-reanimated';
import { Text } from '~/components/ui';
import { PickerInfluence } from '~/components/partials';
import { cn } from '~/lib/cn';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptic from 'expo-haptics';
import { clamp } from '~/lib/utils';

export const InfluenceValue = ({
  min = 0,
  max,
  value = min,
  color,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  color: 'blue' | 'red' | null;
  onChange: (n: number) => void;
}) => {
  ////////////////////////////////////////////////
  // Constanti Layout
  ////////////////////////////////////////////////
  const centerValue = Math.floor((min + max) / 2);

  const ITEM_WIDTH = 32; // (w-8 in tailwind = 32px)

  // limiti di traslazione per non uscire dal range
  const MIN_X = (centerValue - max) * ITEM_WIDTH;
  const MAX_X = (centerValue - min) * ITEM_WIDTH;

  ////////////////////////////////////////////////
  // Stato Gesture
  ////////////////////////////////////////////////

  // posizione orizzontale corrente del picker
  const translateX = useSharedValue((centerValue - value) * ITEM_WIDTH);

  // ultimo valore che ha generato feedback aptico
  // serve per evitare haptic ripetuti sullo stesso numero
  const lastHapticValue = useSharedValue<number>(value);

  ////////////////////////////////////////////////
  // Stato React
  ////////////////////////////////////////////////

  // valore visualizzato durante lo slide
  const [previewValue, setPreviewValue] = useState(value);

  // stato UI: picker aperto / chiuso
  const [active, setActive] = useState(false);

  // colori in base all’influenza
  const bgClass = cn({
    'bg-blue-500': color === 'blue',
    'bg-red-500': color === 'red',
  });
  const textClass = cn({
    'text-blue-500': color === 'blue',
    'text-red-500': color === 'red',
  });

  ////////////////////////////////////////////////
  // Gesture
  ////////////////////////////////////////////////

  // long press: apre il picker e inizializza la gesture
  const longPress = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      setActive(true);
      translateX.set((centerValue - value) * ITEM_WIDTH);
      lastHapticValue.set(value);
    })
    .onTouchesUp(() => {
      // serve per chiudere il picker se l’utente rilascia
      // senza iniziare il pan (Gesture.Simultaneous)
      setActive(false);
    })
    .runOnJS(true);

  // pan: gestisce lo slide e lo snap sui valori discreti
  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (!active) return;

      // posizione base + trascinamento
      const next = (centerValue - value) * ITEM_WIDTH + e.translationX;

      // clamp per restare nel range
      translateX.set(clamp(next, MIN_X, MAX_X));

      // conversione pixel -> valore discreto
      const offset = Math.round(translateX.value / ITEM_WIDTH);
      const nextNumber = centerValue - offset;

      // feedback solo quando cambia valore
      if (nextNumber !== lastHapticValue.value) {
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
        lastHapticValue.set(nextNumber);
        setPreviewValue(nextNumber);
      }
    })
    .onEnd(() => {
      // snap finale al valore selezionato
      translateX.set(withSpring((centerValue - previewValue) * ITEM_WIDTH));
      onChange(previewValue);
      setActive(false);
    })
    .runOnJS(true);

  // long press + pan devono convivere senza esclusione
  const gesture = Gesture.Simultaneous(longPress, pan);

  // swipe prima del long press
  const quickSwipe = Gesture.Pan()
    .onEnd((e) => {
      if (Math.abs(e.translationX) < ITEM_WIDTH / 2) return;

      const direction = e.translationX > 0 ? -1 : 1;
      const next = clamp(previewValue + direction, min, max);

      if (next !== previewValue) {
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
        setPreviewValue(next);
        onChange(next);
      }
    })
    .runOnJS(true);

  useEffect(() => {
    setPreviewValue(value);
    translateX.set((centerValue - value) * ITEM_WIDTH);
    lastHapticValue.set(value);
  }, [value]);

  return (
    <GestureDetector gesture={gesture}>
      <View className="flex-1 items-center">
        {!active && (
          <GestureDetector gesture={quickSwipe}>
            <Animated.View
              entering={FadeIn.duration(250)}
              className={cn('h-10 w-20 items-center justify-center rounded-2xl')}>
              <Text variant={'heading'} className={textClass}>
                {previewValue}
              </Text>
            </Animated.View>
          </GestureDetector>
        )}

        {active && (
          <PickerInfluence
            max={max}
            min={min}
            selected={previewValue}
            translateX={translateX}
            className={bgClass}
          />
        )}
      </View>
    </GestureDetector>
  );
};
