import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fontSize, spacing } from '../theme';

interface AppIconProps {
  name: string;
  icon: string;
  color: string;
  size?: number;
  showLabel?: boolean;
  onPress?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({
  name,
  icon,
  color,
  size = 52,
  showLabel = true,
  onPress,
}) => {
  const inner = (
    <>
      <View style={[styles.iconWrap, { width: size, height: size, borderRadius: size * 0.22, backgroundColor: color }]}>
        <Text style={[styles.emoji, { fontSize: size * 0.42 }]}>{icon}</Text>
      </View>
      {showLabel && (
        <Text style={styles.label} numberOfLines={1}>
          {name}
        </Text>
      )}
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
        {inner}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{inner}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxWidth: 72,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    textAlign: 'center',
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    marginTop: spacing.xs,
    textAlign: 'center',
    maxWidth: 72,
  },
});
