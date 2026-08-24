import React from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography, gradients } from '../../constants/theme';

const pageStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.background,
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  padding: `${spacing.md}px ${spacing.lg}px`,
  borderBottom: `1px solid ${colors.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 28,
  fontWeight: 700,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
  fontFamily: 'inherit',
};

const titleStyle: React.CSSProperties = {
  ...typography.h2,
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const sectionTitleStyle: React.CSSProperties = {
  ...typography.h3,
  margin: `${spacing.md}px 0 ${spacing.sm}px`,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing.md,
};

const actionCardStyle: React.CSSProperties = {
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  minHeight: 100,
  border: '1px solid rgba(255, 114, 35, 0.25)',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
  color: colors.text,
  fontFamily: 'inherit',
  fontSize: 14,
  fontWeight: 600,
  transition: 'opacity 0.2s ease',
};

const actionCardGradients = [
  gradients.cardOrange,
  gradients.cardPink,
  gradients.cardTurquoise,
  gradients.cardPurple,
];

const actionIconStyle: React.CSSProperties = {
  fontSize: 28,
};

const adminActions: { label: string; icon: string; route: string }[] = [
  { label: 'Gestionar usuarios', icon: '👥', route: '/admin/users' },
  { label: 'Gestionar avisos', icon: '📢', route: '/admin/notices' },
  { label: 'Gestionar actividades', icon: '📅', route: '/admin/events' },
  { label: 'Asistencia', icon: '✅', route: '/admin/attendance' },
  { label: 'Cuotas', icon: '💰', route: '/admin/payments' },
  { label: 'QR entrada/salida', icon: '📱', route: '/admin/qr' },
  { label: 'Registro local', icon: '📋', route: '/admin/local-log' },
  { label: 'Registro llaves', icon: '🔑', route: '/admin/keys-log' },
  { label: 'Registro alarma', icon: '🚨', route: '/admin/alarm-log' },
];

const AdminPanelScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/')}>‹</button>
        <h1 style={titleStyle}>Panel de Administración</h1>
      </div>
      <div style={contentStyle}>
        <h3 style={sectionTitleStyle}>Acciones rápidas</h3>
        <div style={gridStyle}>
          {adminActions.map((action, i) => (
            <button
              key={action.route}
              style={{ ...actionCardStyle, background: actionCardGradients[i % actionCardGradients.length] }}
              onClick={() => navigate(action.route)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              <span style={actionIconStyle}>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanelScreen;
