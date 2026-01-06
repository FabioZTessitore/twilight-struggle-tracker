import { View } from 'react-native';
import { Icon, Text } from '~/components/ui';
import { FlipCounter } from '~/components/partials';
import { StyleSheet, SectionList, StatusBar, Pressable } from 'react-native';
import { useState } from 'react';

import Regions from '~/components/ts/Regions';
import { useTrackerStore } from '~/store/tracker';
import { RegionId, Country } from '~/store/types';
import Animated, { FadeOutRight, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function Index() {
  const { regions, countries } = useTrackerStore();

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
        sections={sections}
        keyExtractor={(item) => item.name}
        extraData={expandedSections}
        renderItem={({ section, item }) => {
          if (!expandedSections.has(section.regionId)) return null;
          return (
            <Animated.View exiting={FadeOutRight.duration(50)}>
              <CountryItem country={item} />
            </Animated.View>
          );
        }}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <RegionHeader
            title={section.title}
            isExpanded={expandedSections.has(section.regionId)}
            onPress={() => handleToggle(section.regionId)}
          />
        )}
        stickySectionHeadersEnabled
      />
    </View>
  );
}

const CountryItem = ({ country }: { country: Country }) => (
  <View className="flex-row justify-center gap-8 p-2">
    <FlipCounter count={country.blueInfluence} />

    <View className="w-1/3 items-center">
      <Text>
        {country.name}
        {country.battleground ? ' ★' : ''}
      </Text>
    </View>

    <FlipCounter count={country.redInfluence} />
  </View>
);

const RegionHeader = ({
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
        <Text variant="heading">{title}</Text>

        <Animated.View style={animatedStyle}>
          <Icon name="arrow-right" />
        </Animated.View>
      </Pressable>
    </View>
  );
};
