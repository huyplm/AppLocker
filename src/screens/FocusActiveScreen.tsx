import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Pressable,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { useFocusSession } from '../hooks/useFocusSession';
import { installedApps } from '../data/apps';
import { colors, fontSize, spacing, borderRadius } from '../theme';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'FocusActive'>;
  route: RouteProp<RootStackParamList, 'FocusActive'>;
};

const QUOTES = [
  '"The secret of getting ahead is getting started."',
  '"Focus on being productive instead of busy."',
  '"It is during our darkest moments that we must focus to see the light."',
  '"Starve your distractions, feed your focus."',
];

export const FocusActiveScreen: React.FC<Props> = ({ navigation, route }) => {
  const { durationMinutes, selectedAppIds } = route.params;
  const totalSeconds = durationMinutes * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds);
  const holdProgress = useRef(new Animated.Value(0)).current;
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionSaved = useRef(false);
  const [quote] = useState(
    () => QUOTES[Math.floor(Math.random() * QUOTES.length)],
  );
  const { completeSession } = useFocusSession();

  const elapsed = totalSeconds - remainingSeconds;

  const saveAndExit = useCallback(
    async (completed: boolean) => {
      if (sessionSaved.current) return;
      sessionSaved.current = true;
      await completeSession(
        durationMinutes,
        elapsed,
        selectedAppIds,
        completed,
      );
      navigation.popToTop();
    },
    [completeSession, durationMinutes, elapsed, selectedAppIds, navigation],
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (remainingSeconds === 0 && !sessionSaved.current) {
      saveAndExit(true);
    }
  }, [remainingSeconds, saveAndExit]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;

  const startHold = () => {
    holdProgress.setValue(0);
    Animated.timing(holdProgress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
    holdTimer.current = setTimeout(() => {
      saveAndExit(false);
    }, 3000);
  };

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    Animated.timing(holdProgress, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const progressWidth = holdProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const simulateAppId = selectedAppIds[0];
  const simulateAppName = simulateAppId
    ? installedApps.find((a) => a.id === simulateAppId)?.name ?? simulateAppId
    : 'Instagram';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.shieldContainer}>
          <Text style={styles.shieldIcon}>🛡️</Text>
        </View>

        <Text style={styles.title}>Focus Session Active</Text>
        <Text style={styles.subtitle}>
          Stay focused! {selectedAppIds.length} apps on your avoid list.
        </Text>

        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(progress * 100)}% complete
        </Text>

        <View style={styles.countdownContainer}>
          <Text style={styles.countdown}>{formatTime(remainingSeconds)}</Text>
          <View style={styles.underline} />
          <View style={styles.remainingRow}>
            <Text style={styles.remainingIcon}>⏱</Text>
            <Text style={styles.remainingLabel}>REMAINING</Text>
          </View>
        </View>

        <View style={styles.spacer} />

        <Text style={styles.overrideLabel}>INTENTIONAL OVERRIDE</Text>

        <Pressable
          onPressIn={startHold}
          onPressOut={cancelHold}
          style={styles.breakButton}
        >
          <View style={styles.breakButtonOverflow}>
            <Animated.View
              style={[styles.holdFill, { width: progressWidth }]}
            />
          </View>
          <View style={styles.breakButtonContent}>
            <Text style={styles.breakLockIcon}>🔓</Text>
            <Text style={styles.breakText}>End Session Early</Text>
          </View>
        </Pressable>

        <Text style={styles.holdHint}>
          Press and hold for 3 seconds to confirm you want to end early.
        </Text>

        <Text style={styles.quoteText}>{quote}</Text>

        <TouchableOpacity
          style={styles.debugButton}
          onPress={() =>
            navigation.navigate('LockedPrompt', {
              appName: simulateAppName,
              remainingSeconds,
            })
          }
        >
          <Text style={styles.debugText}>Simulate blocked app tap</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    paddingTop: spacing.xxl,
  },
  shieldContainer: {
    marginBottom: spacing.lg,
  },
  shieldIcon: {
    fontSize: 72,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    marginTop: spacing.lg,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  progressText: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  countdownContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  countdown: {
    color: colors.accent,
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: 4,
  },
  underline: {
    width: 120,
    height: 3,
    backgroundColor: colors.accent,
    borderRadius: 2,
    marginTop: spacing.sm,
  },
  remainingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  remainingIcon: {
    fontSize: 14,
  },
  remainingLabel: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  spacer: {
    flex: 1,
  },
  overrideLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  breakButton: {
    width: '100%',
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  breakButtonOverflow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  holdFill: {
    height: '100%',
    backgroundColor: colors.accentDark,
    borderRadius: borderRadius.md,
  },
  breakButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  breakLockIcon: {
    fontSize: 18,
    marginRight: spacing.md,
  },
  breakText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  holdHint: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.md,
    fontStyle: 'italic',
  },
  quoteText: {
    color: colors.accent,
    fontSize: fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontStyle: 'italic',
    opacity: 0.6,
  },
  debugButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  debugText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
  },
});
