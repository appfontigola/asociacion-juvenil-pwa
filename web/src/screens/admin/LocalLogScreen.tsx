import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { getLocalLog, subscribeToLocalLog, LocalLogEntry } from '../../services/localService';

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

const badgeStyle = (hasExit: boolean): React.CSSProperties => ({
  backgroundColor: hasExit ? colors.success || '#02AF77' : '#FEBE0F',
  color: '#FEF5E6',
  fontSize: 11,
  fontWeight: '600',
  padding: '2px 8px',
  borderRadius: borderRadius.sm,
});

const emptyStyle: React.CSSProperties = {
  ...typography.bodySmall,
  color: colors.textMuted,
  textAlign: 'center',
  marginTop: spacing.xl,
  fontStyle: 'italic',
};

const LocalLogScreen: React.FC = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<LocalLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsub = subscribeToLocalLog(date, (data) => {
      setEntries(data.sort((a, b) => {
        const aTime = a.entryTime?.getTime() || 0;
        const bTime = b.entryTime?.getTime() || 0;
        return bTime - aTime;
      }));
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
        <h1 style={titleStyle}>Registro local</h1>
      </div>

      <div style={dateNavStyle}>
        <button style={navBtnStyle} onClick={() => changeDay(-1)}>‹</button>
        <span style={dateLabelStyle}>{formatDate(date)}</span>
        <button style={navBtnStyle} onClick={() => changeDay(1)}>›</button>
      </div>

      {loading ? (
        <Loading />
      ) : entries.length === 0 ? (
        <p style={emptyStyle}>Sin registros este día</p>
      ) : (
        entries.map((e) => (
          <Card key={e.id} style={cardStyle}>
            <div>
              <div style={nameStyle}>{e.userName}</div>
              <div style={timeStyle}>
                Entrada: {formatTime(e.entryTime)}
                {e.exitTime ? `  ·  Salida: ${formatTime(e.exitTime)}` : ''}
              </div>
            </div>
            <span style={badgeStyle(!!e.exitTime)}>
              {e.exitTime ? 'Completo' : 'Dentro'}
            </span>
          </Card>
        ))
      )}
    </div>
  );
};

export default LocalLogScreen;
