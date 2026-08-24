import React from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { colors, spacing, borderRadius } from '../constants/theme';

const bannerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 80,
  left: spacing.md,
  right: spacing.md,
  backgroundColor: colors.tabBarBackground || '#0B151D',
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing.md,
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  zIndex: 1000,
};

const messageStyle: React.CSSProperties = {
  color: '#FEF5E6',
  fontSize: 14,
  fontWeight: '500',
  flex: 1,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '10px 16px',
  fontSize: 14,
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

const closeStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'rgba(254, 245, 230, 0.55)',
  fontSize: 20,
  cursor: 'pointer',
  padding: '0 4px',
  lineHeight: 1,
};

const InstallBanner: React.FC = () => {
  const { canInstall, install } = useInstallPrompt();
  const [dismissed, setDismissed] = React.useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div style={bannerStyle}>
      <span style={messageStyle}>
        Instala la app para usarla sin conexión
      </span>
      <button style={buttonStyle} onClick={install}>
        Instalar
      </button>
      <button style={closeStyle} onClick={() => setDismissed(true)}>
        ×
      </button>
    </div>
  );
};

export default InstallBanner;
