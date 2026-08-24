import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, borderRadius, spacing, typography, shadows } from '../../constants/theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const isDisabled = disabled || loading;

  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.base, styles[`size_${size}`]];
    base.push(styles[`variant_${variant}`]);
    if (isDisabled) base.push(styles.disabled);
    return base;
  };

  return (
    <TouchableOpacity
      style={[...getContainerStyle(), style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.text}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.lg,
  },
  size_lg: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
  },
  variant_primary: {
    backgroundColor: colors.primary,
    ...shadows.lg,
  },
  variant_secondary: {
    backgroundColor: colors.surfaceLight,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  variant_danger: {
    backgroundColor: colors.error,
  },
  variant_ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
  text_primary: {
    color: colors.text,
  },
  text_secondary: {
    color: colors.text,
  },
  text_outline: {
    color: colors.primary,
  },
  text_danger: {
    color: colors.text,
  },
  text_ghost: {
    color: colors.primary,
  },
});

export default Button;
