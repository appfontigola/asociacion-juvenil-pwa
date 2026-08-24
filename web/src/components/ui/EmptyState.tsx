import React from 'react';
import { colors, spacing } from '../../constants/theme';

interface EmptyStateProps {
  title: string;
  message?: string;
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.xxl,
  textAlign: 'center',
};

const titleStyle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: colors.text,
  margin: '12px 0 8px',
};

const messageStyle: React.CSSProperties = {
  fontSize: 14,
  color: colors.textMuted,
  margin: 0,
  lineHeight: 1.5,
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, message }) => {
  return (
    <div style={containerStyle}>
      <span style={{ fontSize: 48, lineHeight: 1 }} role="img" aria-label="empty">
        📭
      </span>
      <h3 style={titleStyle}>{title}</h3>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
};

export default EmptyState;
