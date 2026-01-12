import { View } from 'react-native';
import { Text } from '~/components/ui';
import { cn } from '~/lib/cn';
import { useTrackerStore } from '~/store/tracker';
import { Country } from '~/store/types';
import { InfluenceValue } from '~/components/ts/InfluenceValue';

export const CountryItem = ({ country }: { country: Country }) => {
  const { setInfluence } = useTrackerStore();

  const dominateBlue = country.blueInfluence - country.redInfluence >= country.stability;
  const dominateRed = country.redInfluence - country.blueInfluence >= country.stability;

  return (
    <View className="flex-row items-center justify-center gap-6 py-2">
      <View className="w-20">
        <InfluenceValue
          max={10}
          min={0}
          value={country.blueInfluence}
          color={dominateBlue ? 'blue' : null}
          onChange={(newBlueInfluence) => {
            setInfluence(country.name, 'blue', newBlueInfluence);
          }}
        />
      </View>

      <View
        className={cn(
          'w-28 items-center justify-center rounded-2xl p-2',
          country.battleground ? 'bg-purple-950' : 'bg-yellow-100'
        )}>
        <Text
          variant={'label'}
          className={cn(country.battleground ? 'text-foreground' : 'text-background')}>
          {country.name}
        </Text>
      </View>

      <View className="w-20">
        <InfluenceValue
          max={10}
          min={0}
          value={country.redInfluence}
          color={dominateRed ? 'red' : null}
          onChange={(newRedInfluence) => {
            setInfluence(country.name, 'red', newRedInfluence);
          }}
        />
      </View>
    </View>
  );
};
