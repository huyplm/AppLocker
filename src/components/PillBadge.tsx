import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, fontSize, spacing, borderRadius } from '../theme';

type Variant = 'default' | 'active' | 'count';

interface PillBadgeProps {
  text: string;
  variant?: Variant;
}

export const PillBadge: React.FC<PillBadgeProps> = ({
  text,
  variant = 'default',
}) => {
  return (
    <View style={[styles.badge, variant === 'active' && styles.activeBadge, variant === 'count' && styles.countBadge]}>
      <Text
        style={[
          styles.text,
          variant === 'active' && styles.activeText,
          variant === 'count' && styles.countText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeBadge: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accent,
  },
  countBadge: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.border,
  },
  text: {
    color: colors.textSecondary,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  activeText: {
    color: colors.accent,
  },
  countText: {
    color: colors.text,
  },
});
