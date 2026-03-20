import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppIcon } from '../components/AppIcon';
import { PillBadge } from '../components/PillBadge';
import { savePreferences } from '../services/storage';
import { colors, fontSize, spacing, borderRadius } from '../theme';
import { installedApps } from '../data/apps';
import { RootStackParamList, AppInfo } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AppSelection'>;
  route: RouteProp<RootStackParamList, 'AppSelection'>;
};

export const AppSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(route.params.selectedAppIds),
  );

  const sections = useMemo(() => {
    const filtered = installedApps.filter((app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const grouped = filtered.reduce<Record<string, AppInfo[]>>((acc, app) => {
      const letter = app.name[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(app);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map((letter) => ({ title: letter, data: grouped[letter] }));
  }, [searchQuery]);

  const toggleApp = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(installedApps.map((a) => a.id)));
  };

  const clearAll = () => {
    setSelectedIds(new Set());
  };

  const handleDone = useCallback(async () => {
    const ids = [...selectedIds];
    await savePreferences({ selectedAppIds: ids });
    navigation.goBack();
  }, [selectedIds, navigation]);

  const renderItem = ({ item }: { item: AppInfo }) => {
    const isSelected = selectedIds.has(item.id);
    return (
      <TouchableOpacity
        style={styles.appRow}
        onPress={() => toggleApp(item.id)}
        activeOpacity={0.6}
      >
        <AppIcon
          name={item.name}
          icon={item.icon}
          color={item.color}
          size={44}
          showLabel={false}
        />
        <View style={styles.appInfo}>
          <Text style={styles.appName}>{item.name}</Text>
          <Text style={styles.appCategory}>{item.category}</Text>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select apps to avoid</Text>
        <PillBadge text={`${selectedIds.size} Selected`} variant="count" />
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search apps..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>INSTALLED APPLICATIONS</Text>
        <View style={styles.listHeaderActions}>
          <TouchableOpacity onPress={selectAll}>
            <Text style={styles.actionText}>Select All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll}>
            <Text style={styles.actionText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLetter}>{section.title}</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No apps found</Text>
          </View>
        }
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.doneButton}
          onPress={handleDone}
          activeOpacity={0.8}
        >
          <Text style={styles.doneText}>
            Done ({selectedIds.size} selected)
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '300',
  },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: fontSize.md,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  listHeaderText: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1,
  },
  listHeaderActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionText: {
    color: colors.accent,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  sectionLetter: {
    color: colors.textMuted,
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  appInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  appName: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '600',
  },
  appCategory: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.checkboxUnchecked,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkmark: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSize.lg,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  doneButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg - 4,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  doneText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
