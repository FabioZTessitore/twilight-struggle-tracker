import { useState } from 'react';
import { View, SectionList } from 'react-native';
import { Text } from '~/components/ui';
import { useTrackerStore } from '~/store/tracker';
import { RegionId } from '~/store/types';
import { PointSheetModal } from '~/components/ts/PointSheetModal';
import { usePointStore } from '~/store';
import { RegionHeader } from '~/components/ts/RegionHeader';
import { CountryItem } from '~/components/ts/CountryItem';

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
            regionId={section.regionId}
            title={section.title}
            isExpanded={expandedSections.has(section.regionId)}
            onPress={() => handleToggle(section.regionId)}
          />
        )}
      />

      <View className="mb-8 flex-row items-center px-4">
        <Text onPress={() => clearInfluences()}>Reset influenze</Text>
      </View>

      <PointSheetModal visible={pointsModal} onClose={() => setPointsModal(false)} />
    </View>
  );
}
