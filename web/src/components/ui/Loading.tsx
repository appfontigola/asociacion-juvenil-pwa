import React from 'react';
import { colors, spacing } from '../../constants/theme';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const spinnerStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  border: '3px solid ' + colors.border,
  borderTopColor: colors.primary,
  borderRadius: '50%',
  animation: 'spin 0.8s linear infinite',
};

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.md,
};

const fullScreenStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(13, 13, 13, 0.85)',
  zIndex: 9999,
};

const messageStyle: React.CSSProperties = {
  color: colors.textSecondary,
  fontSize: 14,
  textAlign: 'center',
};

const styleId = 'opencode-ui-loading-keyframes';

const Loading: React.FC<LoadingProps> = ({ fullScreen = false, message }) => {
  if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = '@keyframes spin { to { transform: rotate(360deg) } }';
    document.head.appendChild(style);
  }

  const content = (
    <div style={containerStyle}>
      <div style={spinnerStyle} />
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{ ...containerStyle, ...fullScreenStyle }}>
        <div style={spinnerStyle} />
        {message && <p style={messageStyle}>{message}</p>}
      </div>
    );
  }

  return content;
};

export default Loading;
