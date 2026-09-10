import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Loading from '../../components/ui/Loading';
import MiniCalendar from '../../components/ui/MiniCalendar';
import { subscribeToLocalLog, subscribeToLocalLogByUser, LocalLogEntry } from '../../services/localService';
import { getAllUsers } from '../../services/userService';
import { AppUser } from '../../types';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

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

const filterRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  marginBottom: spacing.md,
};

const searchBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? colors.primary : 'transparent',
  border: `1.5px solid ${active ? colors.primary : colors.border}`,
  color: active ? '#FEF5E6' : colors.textSecondary,
  borderRadius: borderRadius.md,
  padding: '8px 12px',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 600,
  fontFamily: 'inherit',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

const monthNavStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.md,
  marginBottom: spacing.md,
};

const monthLabelStyle: React.CSSProperties = {
  ...typography.h3,
  color: '#FEF5E6',
  minWidth: 160,
  textAlign: 'center',
};

const monthBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 24,
  cursor: 'pointer',
  padding: '4px 12px',
};

const filterDropdownStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  padding: spacing.sm,
  marginBottom: spacing.md,
  maxHeight: 250,
  overflow: 'auto',
};

const filterItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  padding: '10px 12px',
  borderRadius: borderRadius.sm,
  border: 'none',
  background: 'transparent',
  color: colors.text,
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'inherit',
  fontSize: 14,
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

const dateLabelStyle: React.CSSProperties = {
  ...typography.caption,
  color: colors.primary,
  fontWeight: 600,
  marginTop: 2,
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
  const [showFilter, setShowFilter] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [filterMonth, setFilterMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);

  useEffect(() => {
    if (showFilter && allUsers.length === 0) {
      getAllUsers().then(setAllUsers).catch(() => {});
    }
  }, [showFilter, allUsers.length]);

  useEffect(() => {
    if (selectedUser) return;
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
  }, [date, selectedUser]);

  useEffect(() => {
    if (!selectedUser) return;
    setLoading(true);
    const startDate = `${filterMonth.year}-${String(filterMonth.month + 1).padStart(2, '0')}-01`;
    const endMonth = filterMonth.month === 11 ? 0 : filterMonth.month + 1;
    const endYear = filterMonth.month === 11 ? filterMonth.year + 1 : filterMonth.year;
    const endDate = `${endYear}-${String(endMonth + 1).padStart(2, '0')}-01`;
    const unsub = subscribeToLocalLogByUser(selectedUser.id, startDate, endDate, (data) => {
      setEntries(data.sort((a, b) => {
        const aTime = a.entryTime?.getTime() || 0;
        const bTime = b.entryTime?.getTime() || 0;
        return bTime - aTime;
      }));
      setLoading(false);
    });
    return unsub;
  }, [selectedUser, filterMonth]);

  const formatTime = (d?: Date) => {
    if (!d) return '—';
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateStr = (d?: Date) => {
    if (!d) return '';
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 style={titleStyle}>Registro local</h1>
      </div>

      {!selectedUser && (
        <MiniCalendar selectedDate={date} onDateSelect={setDate} />
      )}

      <div style={filterRowStyle}>
        <button
          style={searchBtnStyle(!!selectedUser)}
          onClick={() => {
            if (selectedUser) {
              setSelectedUser(null);
              setEntries([]);
            } else {
              setShowFilter(!showFilter);
            }
          }}
        >
          🔍 {selectedUser ? selectedUser.displayName : 'Filtrar usuario'}
        </button>
        {selectedUser && (
          <button
            style={{ ...searchBtnStyle(false), color: colors.danger }}
            onClick={() => {
              setSelectedUser(null);
              setEntries([]);
            }}
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {showFilter && !selectedUser && (
        <div style={filterDropdownStyle}>
          {allUsers.length === 0 ? (
            <p style={{ ...typography.caption, color: colors.textMuted, padding: spacing.sm }}>
              Cargando usuarios...
            </p>
          ) : (
            allUsers.filter((u) => u.active).map((u) => (
              <button
                key={u.id}
                style={filterItemStyle}
                onClick={() => {
                  setSelectedUser(u);
                  setShowFilter(false);
                }}
              >
                <Avatar name={u.displayName} size={32} photoURL={u.photoURL} />
                {u.displayName}
              </button>
            ))
          )}
        </div>
      )}

      {selectedUser && (
        <div style={monthNavStyle}>
          <button
            style={monthBtnStyle}
            onClick={() => setFilterMonth((p) => {
              const m = p.month === 0 ? 11 : p.month - 1;
              const y = p.month === 0 ? p.year - 1 : p.year;
              return { year: y, month: m };
            })}
          >‹</button>
          <span style={monthLabelStyle}>
            {MONTHS[filterMonth.month]} {filterMonth.year}
          </span>
          <button
            style={monthBtnStyle}
            onClick={() => setFilterMonth((p) => {
              const m = p.month === 11 ? 0 : p.month + 1;
              const y = p.month === 11 ? p.year + 1 : p.year;
              return { year: y, month: m };
            })}
          >›</button>
        </div>
      )}

      {loading ? (
        <Loading />
      ) : entries.length === 0 ? (
        <p style={emptyStyle}>
          {selectedUser ? 'Sin registros de este usuario' : 'Sin registros este día'}
        </p>
      ) : (
        entries.map((e) => (
          <Card key={e.id} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, flex: 1 }}>
              <Avatar name={e.userName} size={36} photoURL={e.userPhotoURL} />
              <div>
                <div style={nameStyle}>{e.userName}</div>
                {selectedUser && (
                  <div style={dateLabelStyle}>{formatDateStr(e.entryTime)}</div>
                )}
                <div style={timeStyle}>
                  Entrada: {formatTime(e.entryTime)}
                  {e.exitTime ? `  ·  Salida: ${formatTime(e.exitTime)}` : ''}
                </div>
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
