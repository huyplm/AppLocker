import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors, fontSize, spacing } from '../theme';

interface CircularTimerProps {
  progress: number;
  timeText: string;
  label: string;
  size?: number;
}

export const CircularTimer: React.FC<CircularTimerProps> = ({
  progress,
  timeText,
  label,
  size = 220,
}) => {
  const stroke = 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.surface}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={colors.accent}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={styles.time}>{timeText}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
  time: {
    color: colors.text,
    fontSize: fontSize.hero,
    fontWeight: '200',
    letterSpacing: 2,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: spacing.sm,
  },
});
