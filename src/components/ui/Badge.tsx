import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', size = 'sm', style }) => {
  const bgColors: Record<string, string> = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.error,
    info: colors.secondary,
  };

  return (
    <View
      style={[
        styles.container,
        styles[`size_${size}`],
        { backgroundColor: bgColors[variant] + '20' },
        { borderColor: bgColors[variant] },
        style,
      ]}
    >
      <Text style={[styles.text, styles[`text_${size}`], { color: bgColors[variant] }]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  size_sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm + 2,
  },
  size_md: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md - 2,
  },
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: 11,
  },
  text_md: {
    fontSize: 13,
  },
});

export default Badge;
