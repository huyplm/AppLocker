import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ActionCard } from '../components/ActionCard';
import { PillBadge } from '../components/PillBadge';
import { installedApps } from '../data/apps';
import { colors, fontSize, spacing, borderRadius } from '../theme';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LockedPrompt'>;
  route: RouteProp<RootStackParamList, 'LockedPrompt'>;
};

export const LockedPromptScreen: React.FC<Props> = ({ navigation, route }) => {
  const { appName: appNameParam, remainingSeconds: initialRemaining } =
    route.params;
  const [remainingSeconds, setRemainingSeconds] = useState(initialRemaining);

  const displayName =
    installedApps.find(
      (a) => a.id === appNameParam || a.name === appNameParam,
    )?.name ?? appNameParam;

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.lockContainer}>
          <Text style={styles.lockIcon}>🔒</Text>
          <View style={styles.eyeBadge}>
            <Text style={styles.eyeIcon}>👁</Text>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <PillBadge text="Active Focus Session" variant="active" />
        </View>

        <Text style={styles.title}>Locked — Take a Break?</Text>
        <Text style={styles.description}>
          {displayName} is on your avoid list. You are in a focus session.
          {'\n'}Need a breather?
        </Text>

        <View style={styles.remainingCard}>
          <View style={styles.remainingHeader}>
            <Text style={styles.clockIcon}>⏱</Text>
            <Text style={styles.remainingLabel}>REMAINING</Text>
          </View>
          <Text style={styles.remainingTime}>
            {formatTime(remainingSeconds)}
          </Text>
        </View>

        <ActionCard
          title="Take 5-Min Break"
          subtitle="Preview only — returns to focus screen"
          icon="⏰"
          variant="primary"
          onPress={() => navigation.goBack()}
        />
        <ActionCard
          title="End Focus Session"
          subtitle="Return to home (use End Early on focus screen to log session)"
          icon="⛔"
          variant="danger"
          onPress={() => navigation.popToTop()}
        />

        <TouchableOpacity
          style={styles.returnLink}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.returnIcon}>📱</Text>
          <Text style={styles.returnText}>Return to focus screen</Text>
        </TouchableOpacity>

        <View style={styles.spacer} />

        <View style={styles.scheduledBreak}>
          <Text style={styles.scheduledIcon}>⏰</Text>
          <Text style={styles.scheduledText}>
            Session ends at{' '}
            {new Date(Date.now() + remainingSeconds * 1000).toLocaleTimeString(
              [],
              { hour: '2-digit', minute: '2-digit' },
            )}
          </Text>
        </View>
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
    paddingTop: spacing.xl,
  },
  lockContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  lockIcon: {
    fontSize: 64,
  },
  eyeBadge: {
    position: 'absolute',
    bottom: -4,
    right: -8,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 14,
  },
  statusContainer: {
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '800',
    textAlign: 'center',
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  remainingCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  remainingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  clockIcon: {
    fontSize: 14,
  },
  remainingLabel: {
    color: colors.accent,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  remainingTime: {
    color: colors.text,
    fontSize: fontSize.display,
    fontWeight: '700',
  },
  returnLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  returnIcon: {
    fontSize: 16,
  },
  returnText: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  scheduledBreak: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  scheduledIcon: {
    fontSize: 14,
  },
  scheduledText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: '500',
  },
});
