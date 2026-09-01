import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Theme } from '../utils/theme';

export type NavTabId = 'home' | 'appointments' | 'chat' | 'reminders' | 'records' | 'profile';

interface NavItem {
  id: NavTabId;
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
  route: string;
  badgeCount?: number;
  isAiSparkle?: boolean;
}

interface BottomNavBarProps {
  activeTab?: NavTabId;
}

export default function BottomNavBar({ activeTab }: BottomNavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const getActiveTab = (): NavTabId => {
    if (activeTab) return activeTab;
    if (pathname === '/' || pathname === '/index') return 'home';
    if (pathname.includes('/appointments') || pathname.includes('/waiting-room')) return 'appointments';
    if (pathname.includes('/chat')) return 'chat';
    if (pathname.includes('/reminders')) return 'reminders';
    if (pathname.includes('/health-records')) return 'records';
    if (pathname.includes('/profile')) return 'profile';
    return 'home';
  };

  const currentTab = getActiveTab();

  const NAV_ITEMS: NavItem[] = [
    {
      id: 'home',
      label: 'Home',
      iconActive: 'home',
      iconInactive: 'home-outline',
      route: '/',
    },
    {
      id: 'appointments',
      label: 'Consult',
      iconActive: 'videocam',
      iconInactive: 'videocam-outline',
      route: '/appointments',
    },
    {
      id: 'chat',
      label: 'NEX-AI',
      iconActive: 'sparkles',
      iconInactive: 'sparkles-outline',
      route: '/chat',
      isAiSparkle: true,
    },
    {
      id: 'reminders',
      label: 'Reminders',
      iconActive: 'alarm',
      iconInactive: 'alarm-outline',
      route: '/reminders',
    },
    {
      id: 'records',
      label: 'Records',
      iconActive: 'folder-open',
      iconInactive: 'folder-open-outline',
      route: '/health-records',
    },
  ];

  const handleTabPress = (item: NavItem) => {
    if (currentTab === item.id && (pathname === item.route || (item.route === '/' && pathname === '/index'))) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(item.route as any);
  };

  return (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 12 : 8),
        },
      ]}
    >
      <View style={styles.navBar}>
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;

          if (item.isAiSparkle) {
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.tabButton}
                onPress={() => handleTabPress(item)}
                activeOpacity={0.8}
              >
                <View style={[styles.aiIconCircle, isActive && styles.aiIconCircleActive]}>
                  <Ionicons name={isActive ? item.iconActive : item.iconInactive} size={20} color="#ffffff" />
                </View>
                <Text style={[styles.tabLabel, styles.aiLabel, isActive && styles.aiLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={item.id}
              style={styles.tabButton}
              onPress={() => handleTabPress(item)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconWrapperActive]}>
                <Ionicons
                  name={isActive ? item.iconActive : item.iconInactive}
                  size={22}
                  color={isActive ? Theme.colors.primary : '#64748B'}
                />
                {!!item.badgeCount && item.badgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badgeCount}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    minHeight: 46,
  },
  iconWrapper: {
    width: 38,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapperActive: {
    backgroundColor: '#EEF2FF',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  tabLabelActive: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  tabLabelInactive: {
    color: '#64748B',
    fontWeight: '500',
    fontFamily: Theme.typography.fontFamily.bodyMedium,
  },
  aiIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  aiIconCircleActive: {
    backgroundColor: '#0047AB',
    transform: [{ scale: 1.06 }],
  },
  aiLabel: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontFamily: Theme.typography.fontFamily.bodyBold,
  },
  aiLabelActive: {
    color: '#0047AB',
    fontWeight: '800',
    fontFamily: Theme.typography.fontFamily.bodyExtraBold,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 2,
    backgroundColor: Theme.colors.danger,
    borderRadius: 8,
    minWidth: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
});

