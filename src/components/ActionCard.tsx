import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius } from '../theme';

type Variant = 'primary' | 'danger';

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  variant?: Variant;
  onPress: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  subtitle,
  icon,
  variant = 'primary',
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        variant === 'primary' && styles.primaryCard,
        variant === 'danger' && styles.dangerCard,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  primaryCard: {
    backgroundColor: colors.accentDark,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  dangerCard: {
    backgroundColor: colors.dangerDark,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  icon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  textCol: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginTop: 4,
  },
  chevron: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '300',
  },
});
