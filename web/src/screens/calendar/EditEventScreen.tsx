import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { Event } from '../../types';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';

const dateToInputValue = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

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
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const EditEventScreen: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { getEvent, editEvent } = useEvents();
  const { user } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    setLoadingEvent(true);
    getEvent(eventId).then((data) => {
      if (data) {
        setEvent(data);
        setTitle(data.title);
        setDescription(data.description);
        setDate(dateToInputValue(data.date));
        setTime(data.time);
        setLocation(data.location || '');
      }
      setLoadingEvent(false);
    });
  }, [eventId, getEvent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId || !title.trim() || !date || !time) {
      window.alert('Completa los campos obligatorios: título, fecha y hora');
      return;
    }
    setSaving(true);
    try {
      const eventDate = new Date(date + 'T00:00:00');
      await editEvent(eventId, {
        title: title.trim(),
        description: description.trim(),
        date: eventDate,
        time,
        location: location.trim() || undefined,
      });
      navigate(-1);
    } catch {
      window.alert('Error al guardar los cambios');
      setSaving(false);
    }
  };

  if (loadingEvent) {
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
        <span style={topBarTitleStyle}>Editar actividad</span>
      </div>
      <div style={contentStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <Input
            label="Título *"
            placeholder="Nombre de la actividad"
            value={title}
            onChangeText={setTitle}
          />
          <Input
            label="Descripción"
            placeholder="Describe la actividad..."
            value={description}
            onChangeText={setDescription}
            multiline
            rows={4}
          />
          <Input
            label="Fecha *"
            type="date"
            value={date}
            onChangeText={setDate}
          />
          <Input
            label="Hora *"
            type="time"
            value={time}
            onChangeText={setTime}
          />
          <Input
            label="Ubicación"
            placeholder="Lugar del evento"
            value={location}
            onChangeText={setLocation}
          />
          <Button
            title="Guardar cambios"
            type="submit"
            size="lg"
            loading={saving}
            disabled={saving}
            style={{ marginTop: spacing.sm }}
          />
        </form>
      </div>
    </div>
  );
};

export default EditEventScreen;
