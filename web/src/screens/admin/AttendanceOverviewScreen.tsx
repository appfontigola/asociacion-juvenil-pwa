import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import * as attendanceService from '../../services/attendanceService';
import * as userService from '../../services/userService';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { AppUser, EventAttendance } from '../../types';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.background,
  padding: spacing.lg,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  marginBottom: spacing.lg,
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

const tabsStyle: React.CSSProperties = {
  display: 'flex',
  backgroundColor: colors.surface,
  borderRadius: borderRadius.md,
  padding: 4,
  marginBottom: spacing.lg,
};

const tabButtonStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '10px 0',
  border: 'none',
  borderRadius: borderRadius.sm,
  background: active ? colors.primary : 'transparent',
  color: colors.text,
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background 0.2s ease',
});

const eventRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  padding: spacing.sm,
  borderRadius: borderRadius.sm,
  transition: 'background 0.2s ease',
};

const eventTitleStyle: React.CSSProperties = {
  ...typography.body,
  margin: 0,
  flex: 1,
};

const countsRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.sm,
};

const attendeeListStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
  marginTop: spacing.sm,
  paddingTop: spacing.sm,
  borderTop: `1px solid ${colors.border}`,
};

const attendeeRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '4px 0',
};

const attendeeNameStyle: React.CSSProperties = {
  ...typography.bodySmall,
  margin: 0,
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  backgroundColor: colors.inputBackground,
  border: `1.5px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  color: colors.text,
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
  marginBottom: spacing.md,
  cursor: 'pointer',
};

const userAttendanceRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: spacing.sm,
  borderBottom: `1px solid ${colors.border}`,
};

const emptyTextStyle: React.CSSProperties = {
  ...typography.bodySmall,
  textAlign: 'center',
  marginTop: spacing.xl,
};

const AttendanceOverviewScreen: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading: eventsLoading } = useEvents();

  const [viewMode, setViewMode] = useState<'event' | 'user'>('event');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [attendancesMap, setAttendancesMap] = useState<Record<string, EventAttendance[]>>({});
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState<AppUser[]>([]);
  const [userAttendance, setUserAttendance] = useState<
    { eventTitle: string; eventDate: Date; status: string | null }[]
  >([]);
  const [loadingUserAttendance, setLoadingUserAttendance] = useState(false);

  useEffect(() => {
    userService.getAllUsers().then(setUsers).catch(() => {});
  }, []);

  const toggleExpand = useCallback(
    async (eventId: string) => {
      if (expandedEvent === eventId) {
        setExpandedEvent(null);
        return;
      }
      setExpandedEvent(eventId);
      if (!attendancesMap[eventId]) {
        try {
          const data = await attendanceService.getAttendanceByEvent(eventId);
          setAttendancesMap((prev) => ({ ...prev, [eventId]: data }));
        } catch {
          setAttendancesMap((prev) => ({ ...prev, [eventId]: [] }));
        }
      }
    },
    [expandedEvent, attendancesMap]
  );

  useEffect(() => {
    if (!selectedUserId || events.length === 0) return;
    setLoadingUserAttendance(true);
    const fetchUserAttendance = async () => {
      const results = await Promise.all(
        events.map(async (event) => {
          try {
            const record = await attendanceService.getUserAttendance(event.id, selectedUserId);
            return {
              eventTitle: event.title,
              eventDate: event.date,
              status: record?.status ?? null,
            };
          } catch {
            return { eventTitle: event.title, eventDate: event.date, status: null };
          }
        })
      );
      setUserAttendance(results);
      setLoadingUserAttendance(false);
    };
    fetchUserAttendance();
  }, [selectedUserId, events]);

  const getCounts = (eventId: string) => {
    const list = attendancesMap[eventId] || [];
    return {
      going: list.filter((a) => a.status === 'going').length,
      notGoing: list.filter((a) => a.status === 'not_going').length,
      undecided: list.filter((a) => a.status === 'undecided').length,
    };
  };

  const statusBadge = (status: string | null) => {
    switch (status) {
      case 'going':
        return <Badge label="Va" variant="success" size="sm" />;
      case 'not_going':
        return <Badge label="No va" variant="danger" size="sm" />;
      case 'undecided':
        return <Badge label="Sin decidir" variant="warning" size="sm" />;
      default:
        return <Badge label="Sin respuesta" variant="info" size="sm" />;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 style={titleStyle}>Asistencia</h1>
      </div>

      <div style={tabsStyle}>
        <button
          style={tabButtonStyle(viewMode === 'event')}
          onClick={() => setViewMode('event')}
        >
          Por evento
        </button>
        <button
          style={tabButtonStyle(viewMode === 'user')}
          onClick={() => setViewMode('user')}
        >
          Por usuario
        </button>
      </div>

      {viewMode === 'event' && (
        <>
          {eventsLoading ? (
            <Loading message="Cargando eventos..." />
          ) : events.length === 0 ? (
            <p style={emptyTextStyle}>No hay eventos</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
              {events.map((event) => {
                const counts = getCounts(event.id);
                const isExpanded = expandedEvent === event.id;
                const attendees = attendancesMap[event.id] || [];
                return (
                  <Card key={event.id}>
                    <div
                      style={eventRowStyle}
                      onClick={() => toggleExpand(event.id)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.surfaceLight;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <p style={eventTitleStyle}>{event.title}</p>
                      <div style={countsRowStyle}>
                        <Badge label={`${counts.going}`} variant="success" size="sm" />
                        <Badge label={`${counts.notGoing}`} variant="danger" size="sm" />
                        <Badge label={`${counts.undecided}`} variant="warning" size="sm" />
                        <span style={{ color: colors.textMuted, fontSize: 12, marginLeft: spacing.xs }}>
                          {isExpanded ? '▲' : '▼'}
                        </span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div style={attendeeListStyle}>
                        {attendees.length === 0 ? (
                          <p style={{ ...typography.caption, textAlign: 'center', padding: spacing.sm }}>
                            Sin asistencias registradas
                          </p>
                        ) : (
                          attendees.map((att) => (
                            <div key={att.id} style={attendeeRowStyle}>
                              <p style={attendeeNameStyle}>{att.userName}</p>
                              {statusBadge(att.status)}
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {viewMode === 'user' && (
        <>
          <select
            style={selectStyle}
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="" disabled>
              Seleccionar usuario...
            </option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName}
              </option>
            ))}
          </select>

          {!selectedUserId && (
            <p style={emptyTextStyle}>Selecciona un usuario para ver su asistencia</p>
          )}

          {selectedUserId && loadingUserAttendance && (
            <Loading message="Cargando asistencia..." />
          )}

          {selectedUserId && !loadingUserAttendance && (
            <>
              {userAttendance.every((r) => r.status === null) ? (
                <p style={emptyTextStyle}>Sin respuestas a eventos</p>
              ) : (
                <div>
                  {userAttendance.map((item, idx) => (
                    <div key={idx} style={userAttendanceRowStyle}>
                      <div>
                        <p style={{ ...typography.body, margin: 0 }}>{item.eventTitle}</p>
                        <p style={{ ...typography.caption, margin: '2px 0 0' }}>
                          {new Date(item.eventDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      {statusBadge(item.status)}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceOverviewScreen;
