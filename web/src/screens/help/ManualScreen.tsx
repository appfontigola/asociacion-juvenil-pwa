import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, typography } from '../../constants/theme';

const pageStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.background,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: `${spacing.md}px ${spacing.lg}px`,
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 28,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
  fontFamily: 'inherit',
};

const headerTitleStyle: React.CSSProperties = {
  ...typography.h3,
  marginLeft: spacing.md,
};

const iframeStyle: React.CSSProperties = {
  flex: 1,
  width: '100%',
  border: 'none',
};

const manualSrc = import.meta.env.BASE_URL + 'manual-usuario.html';

const ManualScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/')}>
          &lsaquo;
        </button>
        <span style={headerTitleStyle}>Manual de usuario</span>
      </div>
      <iframe src={manualSrc} style={iframeStyle} title="Manual de usuario" />
    </div>
  );
};

export default ManualScreen;
