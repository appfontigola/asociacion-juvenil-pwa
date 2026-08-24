import React from 'react';
import { gradients, spacing, borderRadius } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onPress?: () => void;
}

const cardStyle: React.CSSProperties = {
  background: gradients.card,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
  border: '1px solid rgba(255, 114, 35, 0.22)',
};

const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
  return (
    <div
      onClick={onPress}
      style={{
        ...cardStyle,
        cursor: onPress ? 'pointer' : undefined,
        transition: onPress ? 'opacity 0.2s ease' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onPress) {
          (e.currentTarget as HTMLElement).style.opacity = '0.9';
        }
      }}
      onMouseLeave={(e) => {
        if (onPress) {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }
      }}
    >
      {children}
    </div>
  );
};

export default Card;
