import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents, useAttendance } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { Event, AttendanceStatus } from '../../types';
import { formatDate } from '../../utils/helpers';
import Loading from '../../components/ui/Loading';
import Avatar from '../../components/ui/Avatar';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
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
  fontSize: 24,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
};

const topBarTitleStyle: React.CSSProperties = {
  ...typography.h3,
  flex: 1,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const labelStyle: React.CSSProperties = {
  ...typography.bodySmall,
  color: colors.textMuted,
  margin: 0,
  marginBottom: spacing.xs,
};

const valueStyle: React.CSSProperties = {
  ...typography.body,
  margin: 0,
};

const sectionStyle: React.CSSProperties = {
  marginBottom: spacing.md,
};

const descriptionStyle: React.CSSProperties = {
  ...typography.body,
  margin: 0,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
};

const actionRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.md,
  marginTop: spacing.lg,
};

const actionButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 20px',
  borderRadius: borderRadius.md,
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'inherit',
  textAlign: 'center',
};

const EventDetailScreen: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEvent, removeEvent } = useEvents();
  const { isAdmin, user } = useAuth();
  const {
    attendances,
    loading: attendanceLoading,
    counts,
    setStatus,
    getUserStatus,
  } = useAttendance(eventId || '');
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    getEvent(eventId).then((data) => {
      setEvent(data);
      setLoading(false);
    });
  }, [eventId, getEvent]);

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;
    if (!eventId) return;
    setDeleting(true);
    try {
      await removeEvent(eventId);
      navigate(-1);
    } catch {
      window.alert('Error al eliminar el evento');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <Loading message="Cargando evento..." />
      </div>
    );
  }

  if (!event) {
    return (
      <div style={pageStyle}>
        <div style={contentStyle}>
          <p style={{ ...typography.body, textAlign: 'center' }}>
            Evento no encontrado
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          ‹
        </button>
        <span style={topBarTitleStyle}>{event.title}</span>
      </div>
      <div style={contentStyle}>
        <div style={sectionStyle}>
          <p style={labelStyle}>Descripción</p>
          <p style={descriptionStyle}>
            {event.description || 'Sin descripción'}
          </p>
        </div>

        <div style={sectionStyle}>
          <p style={labelStyle}>Fecha</p>
          <p style={valueStyle}>{formatDate(event.date)}</p>
        </div>

        <div style={sectionStyle}>
          <p style={labelStyle}>Hora</p>
          <p style={valueStyle}>{event.time}</p>
        </div>

        {event.location && (
          <div style={sectionStyle}>
            <p style={labelStyle}>Ubicación</p>
            <p style={valueStyle}>{event.location}</p>
          </div>
        )}

        <div style={{ ...sectionStyle, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <Avatar name={event.authorName} size={22} photoURL={event.authorPhotoURL} />
          <p style={valueStyle}>{event.authorName}</p>
        </div>

        <div style={sectionStyle}>
          <p style={labelStyle}>Mi asistencia</p>
          <div style={actionRowStyle}>
            {(['going', 'not_going', 'undecided'] as AttendanceStatus[]).map((status) => {
              const labels: Record<AttendanceStatus, string> = {
                going: '✔ Asistiré',
                not_going: '✘ No iré',
                undecided: '? Pendiente',
              };
              const isActive = getUserStatus(user?.id || '') === status;
              return (
                <button
                  key={status}
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    color: isActive ? '#FEF5E6' : colors.text,
                    border: isActive ? 'none' : `1.5px solid ${colors.border}`,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = colors.surfaceLight;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = colors.surface;
                    }
                  }}
                  onClick={() => user && setStatus(user.id, user.displayName, status)}
                >
                  {labels[status]}
                </button>
              );
            })}
          </div>
        </div>

        <AttendanceInfo attendances={attendances} user={user} />

        {isAdmin && (
          <div style={actionRowStyle}>
            <button
              style={{
                ...actionButtonStyle,
                backgroundColor: colors.primary,
                color: '#FEF5E6',
              }}
              onClick={() => navigate(`/calendar/edit/${eventId}`)}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '0.85';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = '1';
              }}
            >
              Editar
            </button>
            <button
              style={{
                ...actionButtonStyle,
                backgroundColor: colors.error,
                color: '#FEF5E6',
                opacity: deleting ? 0.5 : 1,
                cursor: deleting ? 'not-allowed' : 'pointer',
              }}
              onClick={handleDelete}
              disabled={deleting}
              onMouseEnter={(e) => {
                if (!deleting) {
                  (e.currentTarget as HTMLElement).style.opacity = '0.85';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = deleting ? '0.5' : '1';
              }}
            >
              {deleting ? '...' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailScreen;

interface AttendanceInfoProps {
  attendances: { userId: string; userName: string; status: AttendanceStatus }[];
  user: { id: string } | null;
}

const AttendanceInfo: React.FC<AttendanceInfoProps> = ({ attendances, user }) => {
  const going = attendances.filter((a) => a.status === 'going');
  const notGoing = attendances.filter((a) => a.status === 'not_going');
  const undecided = attendances.filter((a) => a.status === 'undecided');
  const others = attendances.filter((a) => a.userId !== user?.id);

  return (
    <>
      <div style={sectionStyle}>
        <p style={labelStyle}>Asistirán ({going.length})</p>
        {going.length === 0 ? (
          <p style={{ ...valueStyle, color: colors.textMuted }}>Nadie aún</p>
        ) : (
          going.map((a) => <p key={a.userId} style={valueStyle}>{a.userName}</p>)
        )}
      </div>
      {others.filter((a) => a.status === 'not_going').length > 0 && (
        <div style={sectionStyle}>
          <p style={labelStyle}>No irán ({notGoing.length})</p>
          {notGoing.map((a) => <p key={a.userId} style={valueStyle}>{a.userName}</p>)}
        </div>
      )}
      {others.filter((a) => a.status === 'undecided').length > 0 && (
        <div style={sectionStyle}>
          <p style={labelStyle}>Pendientes ({undecided.length})</p>
          {undecided.map((a) => <p key={a.userId} style={valueStyle}>{a.userName}</p>)}
        </div>
      )}
    </>
  );
};
