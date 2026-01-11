import { useState } from 'react';
import { View, SectionList, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Icon, Text } from '~/components/ui';
import { PickerInfluence } from '~/components/partials';
import { cn } from '~/lib/cn';
import { useTrackerStore } from '~/store/tracker';
import { RegionId, Country, Power } from '~/store/types';
import { PointSheetModal } from '~/components/ts/PointSheetModal';
import { usePointStore } from '~/store';
import { computeRegionScore } from '~/lib/gameCalculations';

export default function Index() {
  const { regions, countries, clearInfluences } = useTrackerStore();
  const { pointsModal, setPointsModal } = usePointStore();

  const sections = Object.entries(regions).map(([regionId, region]) => ({
    regionId: regionId as RegionId,
    title: region.name,
    data: countries.filter((c) => c.region === regionId),
  }));
  const [expandedSections, setExpandedSections] = useState(new Set());

  const handleToggle = (title: string) => {
    setExpandedSections((expandedSections) => {
      // Using Set here but you can use an array too
      const next = new Set(expandedSections);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  return (
    <View className="flex-1 px-4">
      <SectionList
        ListHeaderComponent={
          <View className="mb-4 rounded-2xl p-4">
            <Text variant={'heading'} color={'primary'}>
              Punti Potenziali: 3
            </Text>
          </View>
        }
        stickySectionHeadersEnabled
        sections={sections}
        keyExtractor={(item) => item.name}
        extraData={expandedSections}
        renderItem={({ section, item }) => {
          if (!expandedSections.has(section.regionId)) return null;
          return <CountryItem country={item} />;
        }}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <RegionHeader
            title={section.title}
            regionId={section.regionId}
            isExpanded={expandedSections.has(section.regionId)}
            onPress={() => handleToggle(section.regionId)}
          />
        )}
      />

      <View className="mb-8 flex-row items-center justify-between px-4">
        <Text onPress={() => clearInfluences()}>Reset influenze</Text>
      </View>

      <PointSheetModal visible={pointsModal} onClose={() => setPointsModal(false)} />
    </View>
  );
}

const CountryItem = ({ country }: { country: Country }) => {
  const { setInfluence, regions, countries, regionsStatus } = useTrackerStore();

  return (
    <View className="flex-row items-center justify-center gap-6 p-2">
      <PickerInfluence
        className={country.controlledBy === Power.USA && 'bg-blue-500'}
        max={10}
        min={0}
        value={country.blueInfluence}
        onChange={(newBlueInfluence) => {
          setInfluence(country.name, 'blue', newBlueInfluence);
        }}
      />

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

      <PickerInfluence
        className={country.controlledBy === Power.URSS && 'bg-red-500'}
        max={10}
        min={0}
        value={country.redInfluence}
        onChange={(newRedInfluence) => {
          setInfluence(country.name, 'red', newRedInfluence);
        }}
      />
    </View>
  );
};

const RegionHeader = ({
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

  // Calcolo punteggio per entrambe le superpotenze
  const usaScore = computeRegionScore(regionId, Power.USA, regions, regionsStatus, countries);
  const urssScore = computeRegionScore(regionId, Power.URSS, regions, regionsStatus, countries);

  let diffScore = usaScore - urssScore;
  let displayScore = Math.abs(diffScore);
  let bgColor = '';

  if (diffScore > 0) bgColor = 'bg-blue-500';
  else if (diffScore < 0) bgColor = 'bg-red-500';
  else displayScore = 0; // nessuna potenza prevale

  return (
    <View className="mb-2 rounded-2xl bg-card">
      <Pressable className="flex-row items-center justify-between p-4" onPress={onPress}>
        <View className={cn('rounded-full px-3 py-1', bgColor)}>
          <Text variant="heading" className="text-white">
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
