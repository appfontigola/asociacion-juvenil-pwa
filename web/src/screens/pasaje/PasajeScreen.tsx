import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { usePasajePresence } from '../../hooks/usePasajePresence';
import UserPresenceCard from '../../components/local/UserPresenceCard';
import EmptyState from '../../components/ui/EmptyState';
import Loading from '../../components/ui/Loading';
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

const topBarTitleStyle: React.CSSProperties = {
  ...typography.h3,
  color: colors.primary,
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  ...typography.caption,
  margin: '2px 0 0',
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

const toggleCardStyle: React.CSSProperties = {
  background: gradients.card,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing.md,
  border: '1px solid rgba(255, 114, 35, 0.22)',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
};

const toggleInfoStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
};

const toggleIconStyle: React.CSSProperties = {
  fontSize: 24,
};

const toggleLabelStyle: React.CSSProperties = {
  ...typography.body,
  fontWeight: 600,
  margin: 0,
};

const toggleButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: borderRadius.md,
  border: 'none',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.2s ease',
};

const userListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
};

const PasajeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeUsers, loading, enterPasaje, leavePasaje } = usePasajePresence();

  const currentUserId = user?.id;
  const currentUserName = user?.displayName || '';
  const currentPhotoURL = user?.photoURL;

  const isInPasaje = activeUsers.some((u) => u.userId === currentUserId);

  const handleToggle = () => {
    if (!currentUserId) return;
    if (isInPasaje) {
      leavePasaje(currentUserId);
    } else {
      enterPasaje(currentUserId, currentUserName, currentPhotoURL);
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate('/')}>‹</button>
          <div>
            <h1 style={topBarTitleStyle}>Pasaje 2026</h1>
          </div>
        </div>
        <div style={contentStyle}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/')}>‹</button>
        <div>
          <h1 style={topBarTitleStyle}>Pasaje 2026</h1>
          <p style={subtitleStyle}>{activeUsers.length} personas en el pasaje</p>
        </div>
      </div>
      <div style={contentStyle}>
        <div style={toggleCardStyle}>
          <div style={toggleInfoStyle}>
            <span style={toggleIconStyle}>🎫</span>
            <p style={toggleLabelStyle}>¿Estás en el pasaje?</p>
          </div>
          <button
            style={{
              ...toggleButtonStyle,
              backgroundColor: isInPasaje ? colors.error : colors.primary,
              color: '#FEF5E6',
            }}
            onClick={handleToggle}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            {isInPasaje ? 'Salir del pasaje' : 'Estoy en el pasaje'}
          </button>
        </div>

        <h3 style={sectionTitleStyle}>Personas en el pasaje</h3>
        {activeUsers.length === 0 ? (
          <EmptyState title="No hay nadie en el pasaje" message="Parece que no hay nadie en este momento." />
        ) : (
          <div style={userListStyle}>
            {activeUsers.map((u) => (
              <UserPresenceCard key={u.userId} user={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PasajeScreen;
