import React from 'react';
import { colors, gradients, borderRadius } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  type?: 'button' | 'submit';
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: {
    background: gradients.primary,
    color: '#FEF5E6',
    border: 'none',
    boxShadow: '0 4px 14px rgba(255, 114, 35, 0.35)',
  },
  secondary: { backgroundColor: colors.surfaceLight, color: '#FEF5E6', border: 'none' },
  outline: { backgroundColor: 'transparent', color: colors.primary, border: `1.5px solid ${colors.primary}` },
  danger: {
    background: gradients.pink,
    color: '#FEF5E6',
    border: 'none',
    boxShadow: '0 4px 14px rgba(255, 164, 191, 0.3)',
  },
  text: { backgroundColor: 'transparent', color: colors.primary, border: 'none' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '6px 12px', fontSize: 13 },
  md: { padding: '10px 20px', fontSize: 15 },
  lg: { padding: '14px 28px', fontSize: 16 },
};

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={!disabled && !loading ? onPress : undefined}
      disabled={disabled}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: borderRadius.md,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        outline: 'none',
        transition: 'opacity 0.2s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLElement).style.opacity = '0.85';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = disabled ? '0.5' : '1';
      }}
    >
      {loading ? '...' : title}
    </button>
  );
};

export default Button;
