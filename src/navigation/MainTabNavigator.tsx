import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/home/HomeScreen';
import NoticesStackNavigator from './NoticesStackNavigator';
import CalendarStackNavigator from './CalendarStackNavigator';
import LocalScreen from '../screens/local/LocalScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { useAuth } from '../hooks/useAuth';
import { NavContext } from './NavContext';
import { colors, typography } from '../constants/theme';

interface TabConfig {
  key: string;
  icon: string;
  label: string;
}

const TABS: TabConfig[] = [
  { key: 'Home', icon: '🏠', label: 'Inicio' },
  { key: 'NoticesTab', icon: '📢', label: 'Avisos' },
  { key: 'CalendarTab', icon: '📅', label: 'Calendario' },
  { key: 'LocalTab', icon: '📍', label: 'Local' },
  { key: 'ProfileTab', icon: '👤', label: 'Perfil' },
];

interface TabIconProps {
  icon: string;
  focused: boolean;
  label: string;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, focused, label }) => (
  <View style={tabIconStyles.container}>
    <Text style={[tabIconStyles.icon, focused && tabIconStyles.active]}>
      {icon}
    </Text>
    <Text style={[tabIconStyles.label, focused && tabIconStyles.activeLabel]}>
      {label}
    </Text>
  </View>
);

const tabIconStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  active: {
    opacity: 1,
  },
  label: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
});

interface MainTabNavigatorProps {
  onOpenAdmin: () => void;
}

const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({ onOpenAdmin }) => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('Home');
  const insets = useSafeAreaInsets();

  const navigate = useCallback(
    (screen: string, params?: Record<string, any>) => {
      const tabKeys = TABS.map(t => t.key);
      if (tabKeys.includes(screen)) {
        setActiveTab(screen);
      } else if (screen === 'AdminPanel') {
        onOpenAdmin();
      }
    },
    [onOpenAdmin]
  );

  const goBack = useCallback(() => {}, []);

  const addFocusListener = useCallback((callback: () => void) => {
    callback();
    return () => {};
  }, []);

  const navValue = {
    navigate,
    goBack,
    routeParams: {} as Record<string, any>,
    screenName: activeTab,
    addFocusListener,
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'NoticesTab':
        return <NoticesStackNavigator parentNavigate={navigate} parentGoBack={goBack} />;
      case 'CalendarTab':
        return <CalendarStackNavigator parentNavigate={navigate} parentGoBack={goBack} />;
      case 'LocalTab':
        return <LocalScreen />;
      case 'ProfileTab':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <NavContext.Provider value={navValue}>
      <View style={styles.container}>
        <View style={styles.content}>
          {renderContent()}
        </View>
        <View style={[styles.tabBar, { height: 60 + insets.bottom, paddingBottom: insets.bottom }]}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => navigate(tab.key)}
              activeOpacity={0.7}
            >
              <TabIcon
                icon={tab.icon}
                focused={activeTab === tab.key}
                label={tab.label}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </NavContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBarBackground,
    borderTopColor: colors.tabBarBorder,
    borderTopWidth: 1,
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainTabNavigator;
