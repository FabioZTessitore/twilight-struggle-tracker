import { Tabs, Href } from 'expo-router';
import { useColorScheme } from '~/lib/useColorScheme';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { TabBarIcon } from '~/components/partials';

type TabsProps = BottomTabNavigationOptions & {
  href?: Href | null;
};

export default function TabLayout() {
  const { colors } = useColorScheme();

  const SCREEN_OPTIONS = {
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerShown: true,
    headerShadowVisible: false,
    headerTitleContainerStyle: { marginLeft: 24 },
  } as TabsProps;

  const INDEX_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'TS Tracker',
    headerTitleStyle: { fontSize: 24 },
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon type="FontAwesome5" name="calculator" active={focused} />
    ),
  } as TabsProps;

  const DONATE_OPTIONS = {
    ...SCREEN_OPTIONS,
    title: 'Donate',
    tabBarIcon: ({ focused, size }) => (
      <TabBarIcon type="FontAwesome5" name="donate" active={focused} />
    ),
  } as TabsProps;

  return (
    <Tabs>
      <Tabs.Screen name="index" options={INDEX_OPTIONS} />
      <Tabs.Screen name="two" options={DONATE_OPTIONS} />
    </Tabs>
  );
}
