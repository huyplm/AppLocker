import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CircularTimer } from '../components/CircularTimer';
import { PillBadge } from '../components/PillBadge';
import { AppIcon } from '../components/AppIcon';
import { TimePresetButton } from '../components/TimePresetButton';
import { useFocusSession } from '../hooks/useFocusSession';
import { colors, fontSize, spacing, borderRadius } from '../theme';
import { installedApps } from '../data/apps';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const PRESETS = [15, 30, 60];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { preferences, stats, updatePreferences, reload } = useFocusSession();
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);

  useEffect(() => {
    setDurationMinutes(preferences.defaultDuration);
    setSelectedAppIds(preferences.selectedAppIds);
  }, [preferences]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      reload();
    });
    return unsub;
  }, [navigation, reload]);

  const selectedApps = installedApps.filter((app) =>
    selectedAppIds.includes(app.id),
  );
  const activePreset = PRESETS.find((p) => p === durationMinutes);

  const formatTime = (mins: number) => `${mins}:00`;

  const handleDurationChange = useCallback(
    (val: number) => {
      const rounded = Math.round(val);
      setDurationMinutes(rounded);
      updatePreferences({ defaultDuration: rounded });
    },
    [updatePreferences],
  );

  const handleStartFocus = useCallback(() => {
    navigation.navigate('FocusActive', {
      durationMinutes,
      selectedAppIds,
    });
  }, [durationMinutes, selectedAppIds, navigation]);

  const handleAppSelectionPress = useCallback(() => {
    navigation.navigate('AppSelection', { selectedAppIds });
  }, [selectedAppIds, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.topBarIcon}>⚙️</Text>
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>⚡</Text>
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.topBarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {stats.totalSessions > 0 && (
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.completedSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {stats.totalFocusMinutes >= 60
                  ? `${Math.floor(stats.totalFocusMinutes / 60)}h ${stats.totalFocusMinutes % 60}m`
                  : `${stats.totalFocusMinutes}m`}
              </Text>
              <Text style={styles.statLabel}>Total Focus</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {stats.currentStreak > 0 ? `🔥 ${stats.currentStreak}` : '0'}
              </Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        )}

        <View style={styles.statusContainer}>
          <PillBadge text="READY TO FOCUS" />
        </View>

        <View style={styles.timerContainer}>
          <CircularTimer
            progress={1}
            timeText={formatTime(durationMinutes)}
            label="SESSION TARGET"
          />
        </View>

        <View style={styles.presetRow}>
          {PRESETS.map((p) => (
            <TimePresetButton
              key={p}
              label={`${p}m`}
              active={activePreset === p}
              onPress={() => {
                setDurationMinutes(p);
                updatePreferences({ defaultDuration: p });
              }}
            />
          ))}
        </View>

        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Text style={styles.sliderLabel}>CUSTOM TIME</Text>
            <Text style={styles.sliderValue}>{durationMinutes} minutes</Text>
          </View>
          <Slider
            minimumValue={5}
            maximumValue={120}
            step={5}
            value={durationMinutes}
            onValueChange={(val) => setDurationMinutes(Math.round(val))}
            onSlidingComplete={handleDurationChange}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor={colors.surface}
            thumbTintColor={colors.text}
            style={styles.slider}
          />
        </View>

        <View style={styles.appsSection}>
          <View style={styles.appsSectionHeader}>
            <Text style={styles.appsSectionTitle}>APPS TO AVOID</Text>
            <PillBadge text={`${selectedApps.length} Total`} variant="count" />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.appsRow}
          >
            {selectedApps.map((app) => (
              <View key={app.id} style={styles.appItem}>
                <AppIcon
                  name={app.name}
                  icon={app.icon}
                  color={app.color}
                  size={52}
                  showLabel={false}
                  onPress={handleAppSelectionPress}
                />
              </View>
            ))}
            <TouchableOpacity
              style={styles.addAppButton}
              onPress={handleAppSelectionPress}
            >
              <Text style={styles.addAppPlus}>+</Text>
              <Text style={styles.addAppLabel}>ADD</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={handleStartFocus}
        >
          <Text style={styles.startIcon}>▶</Text>
          <Text style={styles.startText}>Start Focus</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarIcon: {
    fontSize: 22,
  },
  logoContainer: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 20,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.border,
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  timerContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  sliderSection: {
    marginTop: spacing.xl,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sliderLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  sliderValue: {
    color: colors.accent,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  appsSection: {
    marginTop: spacing.lg,
  },
  appsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  appsSectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  appsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  appItem: {
    marginRight: spacing.md,
  },
  addAppButton: {
    width: 52,
    height: 52,
    borderRadius: 52 * 0.22,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAppPlus: {
    color: colors.textMuted,
    fontSize: 20,
    lineHeight: 22,
  },
  addAppLabel: {
    color: colors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg - 4,
    borderRadius: borderRadius.xl,
    marginTop: spacing.xl,
  },
  startIcon: {
    color: colors.text,
    fontSize: fontSize.lg,
    marginRight: spacing.sm,
  },
  startText: {
    color: colors.text,
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
});
