import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

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

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: spacing.md,
};

const eventItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: spacing.md,
};

const eventInfoStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const eventTitleStyle: React.CSSProperties = {
  ...typography.body,
  margin: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const eventDateStyle: React.CSSProperties = {
  ...typography.caption,
  margin: '4px 0 0',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
};

const ManageEventsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { events, loading } = useEvents();

  const formatDateTime = (date: Date, time: string) => {
    const d = new Date(date);
    const dateStr = d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return `${dateStr} · ${time}`;
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/admin')}>
          ‹
        </button>
        <h1 style={titleStyle}>Gestionar actividades</h1>
      </div>

      <div style={topBarStyle}>
        <Button
          title="Crear actividad"
          onPress={() => navigate('/admin/create-event')}
          size="sm"
        />
      </div>

      {loading ? (
        <Loading message="Cargando actividades..." />
      ) : events.length === 0 ? (
        <p style={{ ...typography.bodySmall, textAlign: 'center', marginTop: spacing.xl }}>
          No hay actividades disponibles
        </p>
      ) : (
        <div style={listStyle}>
          {events.map((event) => (
            <Card key={event.id}>
              <div style={eventItemStyle}>
                <div style={eventInfoStyle}>
                  <p style={eventTitleStyle}>{event.title}</p>
                  <p style={eventDateStyle}>{formatDateTime(event.date, event.time)}</p>
                </div>
                <Button
                  title="Editar"
                  variant="outline"
                  size="sm"
                  onPress={() => navigate(`/admin/edit-event/${event.id}`)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEventsScreen;
