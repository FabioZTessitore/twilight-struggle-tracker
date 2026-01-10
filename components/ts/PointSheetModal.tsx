import { useEffect, useId, useRef, useState } from 'react';
import { SheetModal } from '~/components/partials';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Pressable, View } from 'react-native';
import { Text, Stepper } from '~/components/ui';
import { usePointStore } from '~/store';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const PointSheetModal = ({ visible, onClose }: Props) => {
  const { actualPoints, setActualPoints } = usePointStore();

  return (
    <SheetModal visible={visible} onClose={onClose} snapPoints={['75%', '95%']}>
      <BottomSheetView className="flex-1 gap-8 p-4">
        <View className="flex-row items-center justify-between py-2">
          <Text variant="heading">Punti</Text>
        </View>

        <View className="gap-8 px-4 pt-8">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Text>Punti Attuali:</Text>
              <Text color={'primary'}> {actualPoints}</Text>
            </View>

            <Stepper
              className="py-1"
              minusButton={{
                disabled: actualPoints === 0,
                onPress: () => setActualPoints(actualPoints + 1),
              }}
              plusButton={{
                onPress: () => setActualPoints(actualPoints + 1),
              }}
            />
          </View>
        </View>
      </BottomSheetView>
    </SheetModal>
  );
};
