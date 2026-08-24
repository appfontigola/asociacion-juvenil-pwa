import React from 'react';
import { borderRadius } from '../../constants/theme';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md';
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: '#FF7223', color: '#FEF5E6' },
  success: { backgroundColor: '#02AF77', color: '#0B151D' },
  danger: { backgroundColor: '#FF7223', color: '#FEF5E6' },
  warning: { backgroundColor: '#FEBE0F', color: '#0B151D' },
  info: { backgroundColor: '#4E8ABC', color: '#FEF5E6' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { fontSize: 11, padding: '2px 8px' },
  md: { fontSize: 13, padding: '4px 12px' },
};

const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', size = 'sm' }) => {
  return (
    <span
      style={{
        display: 'inline-block',
        fontWeight: 600,
        borderRadius: borderRadius.sm,
        lineHeight: 1.4,
        ...variantStyles[variant],
        ...sizeStyles[size],
      }}
    >
      {label}
    </span>
  );
};

export default Badge;
