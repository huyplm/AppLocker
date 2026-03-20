import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, fontSize, borderRadius, spacing } from '../theme';

interface TimePresetButtonProps {
  label: string;
  active?: boolean;
  onPress: () => void;
}

export const TimePresetButton: React.FC<TimePresetButtonProps> = ({
  label,
  active,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, active && styles.activeButton]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
    minWidth: 80,
    alignItems: 'center',
  },
  activeButton: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDark,
  },
  text: {
    color: colors.textSecondary,
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  activeText: {
    color: colors.text,
  },
});
