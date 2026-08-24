import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { subscribeToAlarmLog, AlarmLogEntry } from '../../services/alarmService';

const containerStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.background,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  marginBottom: spacing.md,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 28,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
};

const titleStyle: React.CSSProperties = {
  ...typography.h2,
  flex: 1,
};

const dateNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.md,
  marginBottom: spacing.lg,
};

const navBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 24,
  cursor: 'pointer',
  padding: '4px 12px',
};

const dateLabelStyle: React.CSSProperties = {
  ...typography.h3,
  color: '#FEF5E6',
  minWidth: 140,
  textAlign: 'center',
};

const cardStyle: React.CSSProperties = {
  padding: spacing.md,
  marginBottom: spacing.sm,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: spacing.md,
};

const nameStyle: React.CSSProperties = {
  ...typography.body,
  color: '#FEF5E6',
  fontWeight: '500',
};

const timeStyle: React.CSSProperties = {
  ...typography.caption,
  color: colors.textMuted,
};

const badgeStyle = (action: string): React.CSSProperties => ({
  backgroundColor: action === 'activate' ? colors.success || '#02AF77' : colors.warning,
  color: '#FEF5E6',
  fontSize: 11,
  fontWeight: '600',
  padding: '2px 8px',
  borderRadius: borderRadius.sm,
  whiteSpace: 'nowrap',
});

const videoLinkStyle: React.CSSProperties = {
  color: colors.primary,
  fontSize: 12,
  textDecoration: 'none',
  fontWeight: 600,
};

const emptyStyle: React.CSSProperties = {
  ...typography.bodySmall,
  color: colors.textMuted,
  textAlign: 'center',
  marginTop: spacing.xl,
  fontStyle: 'italic',
};

const AlarmLogScreen: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<AlarmLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToAlarmLog(date, (data) => {
      setEntries(data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      setLoading(false);
    });
    return unsub;
  }, [date]);

  const changeDay = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split('T')[0]);
  };

  const formatTime = (d?: Date) => {
    if (!d) return '—';
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (d: string) => {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 style={titleStyle}>Registro alarma</h1>
      </div>

      <div style={dateNavStyle}>
        <button style={navBtnStyle} onClick={() => changeDay(-1)}>‹</button>
        <span style={dateLabelStyle}>{formatDate(date)}</span>
        <button style={navBtnStyle} onClick={() => changeDay(1)}>›</button>
      </div>

      {loading ? (
        <Loading />
      ) : entries.length === 0 ? (
        <p style={emptyStyle}>Sin registros de alarma este día</p>
      ) : (
        entries.map((e) => (
          <Card key={e.id} style={cardStyle}>
            <div style={{ flex: 1 }}>
              <div style={nameStyle}>{e.userName}</div>
              <div style={timeStyle}>
                {formatTime(e.timestamp)} · {e.action === 'activate' ? 'Alarma conectada' : 'Alarma desactivada'}
              </div>
              {e.videoUrl && (
                <a
                  href={e.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={videoLinkStyle}
                >
                  ▶ Ver vídeo{e.videoName ? ` (${e.videoName})` : ''}
                </a>
              )}
              {!e.videoUrl && e.videoName && (
                <div style={timeStyle}>Vídeo adjunto: {e.videoName}</div>
              )}
            </div>
            <span style={badgeStyle(e.action)}>
              {e.action === 'activate' ? 'Activada' : 'Desactivada'}
            </span>
          </Card>
        ))
      )}
    </div>
  );
};

export default AlarmLogScreen;