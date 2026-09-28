import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLocalPresence } from '../../hooks/useLocalPresence';
import { useLocalKeys } from '../../hooks/useLocalKeys';
import UserPresenceCard from '../../components/local/UserPresenceCard';
import EmptyState from '../../components/ui/EmptyState';
import Loading from '../../components/ui/Loading';
import AlarmModal from '../../components/alarm/AlarmModal';
import { addAlarmLogEntry, AlarmAction } from '../../services/alarmService';
import { uploadVideoToDropbox } from '../../services/dropboxService';
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

const LocalScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeUsers, loading: loadingPresence, enterLocal, leaveLocal } = useLocalPresence();
  const { keyHolders, loading: loadingKeys, takeKeys, returnKeys } = useLocalKeys();

  const currentUserId = user?.id;
  const currentUserName = user?.displayName || '';
  const currentPhotoURL = user?.photoURL;

  const isInLocal = activeUsers.some((u) => u.userId === currentUserId);
  const hasKeys = keyHolders.some((u) => u.userId === currentUserId);

  const [alarmAction, setAlarmAction] = useState<AlarmAction | null>(null);
  const [savingAlarm, setSavingAlarm] = useState(false);

  const handleTogglePresence = () => {
    if (!currentUserId) return;
    if (isInLocal) {
      setAlarmAction('activate');
    } else {
      enterLocal(currentUserId, currentUserName, currentPhotoURL);
    }
  };

  const proceedWithoutAlarm = () => {
    if (!currentUserId) return;
    leaveLocal(currentUserId);
  };

  const handleAlarmNo = () => {
    setAlarmAction(null);
    proceedWithoutAlarm();
  };

  const handleAlarmYes = async (video: File | null) => {
    if (!currentUserId) return;
    setSavingAlarm(true);
    try {
      let videoUrl: string | undefined;
      if (video) {
        try {
          videoUrl = await uploadVideoToDropbox(video);
        } catch {
          window.alert('No se pudo subir el vídeo a Dropbox. El registro se guardará sin enlace.');
        }
      }
      await leaveLocal(currentUserId);
      await addAlarmLogEntry({
        userId: currentUserId,
        userName: currentUserName,
        userPhotoURL: currentPhotoURL,
        action: 'activate',
        videoName: video?.name,
        videoUrl,
      });
    } finally {
      setSavingAlarm(false);
      setAlarmAction(null);
    }
  };

  const handleToggleKeys = () => {
    if (!currentUserId) return;
    if (hasKeys) {
      returnKeys(currentUserId);
    } else {
      takeKeys(currentUserId, currentUserName, currentPhotoURL);
    }
  };

  if (loadingPresence || loadingKeys) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate('/')}>‹</button>
          <div>
            <h1 style={topBarTitleStyle}>Local</h1>
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
          <h1 style={topBarTitleStyle}>Local</h1>
          <p style={subtitleStyle}>
            {activeUsers.length} personas en el local · {keyHolders.length} llaves
          </p>
        </div>
      </div>
      <div style={contentStyle}>
        <div style={toggleCardStyle}>
          <div style={toggleInfoStyle}>
            <span style={toggleIconStyle}>📍</span>
            <p style={toggleLabelStyle}>¿Estás en el local?</p>
          </div>
          <button
            style={{
              ...toggleButtonStyle,
              backgroundColor: isInLocal ? colors.error : colors.primary,
              color: '#FEF5E6',
            }}
            onClick={handleTogglePresence}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            {isInLocal ? 'Salir del local' : 'Estoy en el local'}
          </button>
        </div>

        <div style={toggleCardStyle}>
          <div style={toggleInfoStyle}>
            <span style={toggleIconStyle}>🔑</span>
            <p style={toggleLabelStyle}>¿Tienes las llaves?</p>
          </div>
          <button
            style={{
              ...toggleButtonStyle,
              backgroundColor: hasKeys ? colors.error : colors.primary,
              color: '#FEF5E6',
            }}
            onClick={handleToggleKeys}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
          >
            {hasKeys ? 'Devolver llaves' : 'Tengo las llaves'}
          </button>
        </div>

        <button
          style={{
            ...toggleCardStyle,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/local/shopping')}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <div style={toggleInfoStyle}>
            <span style={toggleIconStyle}>🛒</span>
            <p style={toggleLabelStyle}>Compras</p>
          </div>
          <span style={{ color: colors.primary, fontSize: 20 }}>›</span>
        </button>

        <h3 style={sectionTitleStyle}>Personas en el local</h3>
        {activeUsers.length === 0 ? (
          <EmptyState title="No hay nadie en el local" message="Parece que no hay nadie en este momento." />
        ) : (
          <div style={userListStyle}>
            {activeUsers.map((u) => (
              <UserPresenceCard key={u.userId} user={u} />
            ))}
          </div>
        )}

        <h3 style={sectionTitleStyle}>Personas con llaves</h3>
        {keyHolders.length === 0 ? (
          <EmptyState title="No hay llaves entregadas" message="Nadie tiene las llaves en este momento." />
        ) : (
          <div style={userListStyle}>
            {keyHolders.map((u) => (
              <UserPresenceCard key={u.userId} user={u} />
            ))}
          </div>
        )}
      </div>

      <AlarmModal
        open={alarmAction !== null}
        action={alarmAction || 'activate'}
        saving={savingAlarm}
        onNo={handleAlarmNo}
        onYes={handleAlarmYes}
      />
    </div>
  );
};

export default LocalScreen;
