import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PillBadge } from '../components/PillBadge';
import { useFocusSession } from '../hooks/useFocusSession';
import { colors, fontSize, spacing, borderRadius } from '../theme';
import { RootStackParamList } from '../types';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Onboarding'>;
};

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { preferences, loaded, updatePreferences } = useFocusSession();

  useEffect(() => {
    if (loaded && preferences.onboardingDone) {
      navigation.replace('Home');
    }
  }, [loaded, preferences.onboardingDone, navigation]);

  const handleGetStarted = useCallback(async () => {
    await updatePreferences({ onboardingDone: true });
    navigation.replace('Home');
  }, [updatePreferences, navigation]);

  if (!loaded) {
    return <View style={styles.placeholder} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topSection}>
          <Text style={styles.shield}>🛡️</Text>
          <Text style={styles.title}>LockerApp</Text>
          <PillBadge text="FOCUS MODE" variant="active" />
        </View>

        <View style={styles.middleSection}>
          <Text style={styles.heading}>
            Take Control of{'\n'}Your Focus
          </Text>
          <Text style={styles.description}>
            Set a timer, pick apps you want to avoid, and track your focus
            sessions. Everything stays on your device.
          </Text>
        </View>

        <View style={styles.featureList}>
          <FeatureRow icon="⏱" text="Customizable focus session timer" />
          <FeatureRow icon="📊" text="Track sessions, minutes, and streaks" />
          <FeatureRow icon="🎯" text="Choose apps to keep off your mind" />
          <FeatureRow icon="💡" text="Motivational quotes while you focus" />
        </View>

        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.8}
            onPress={handleGetStarted}
          >
            <Text style={styles.startText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const FeatureRow: React.FC<{ icon: string; text: string }> = ({
  icon,
  text,
}) => (
  <View style={styles.featureRow}>
    <Text style={styles.featureIcon}>{icon}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  topSection: {
    alignItems: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.md,
  },
  shield: {
    fontSize: 64,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.xxxl,
    fontWeight: '800',
    letterSpacing: 1,
  },
  middleSection: {
    marginTop: spacing.xxl,
  },
  heading: {
    color: colors.text,
    fontSize: fontSize.xxl,
    fontWeight: '700',
    lineHeight: 32,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    lineHeight: 22,
    marginTop: spacing.md,
  },
  featureList: {
    marginTop: spacing.xl,
    gap: spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  featureText: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: '500',
    flex: 1,
  },
  bottomSection: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.xl,
  },
  startButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.lg - 4,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  startText: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
});
