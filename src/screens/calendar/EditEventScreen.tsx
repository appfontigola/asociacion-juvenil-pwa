import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import EventForm from '../../components/calendar/EventForm';
import Loading from '../../components/ui/Loading';
import { useEvents } from '../../hooks/useEvents';
import { Event } from '../../types';
import { colors, spacing } from '../../constants/theme';

const EditEventScreen: React.FC = () => {
  const { goBack, routeParams } = useNav();
  const { eventId } = routeParams;
  const { getEvent, editEvent } = useEvents();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getEvent(eventId);
      setEvent(data);
      setLoading(false);
    };
    load();
  }, [eventId, getEvent]);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
  }) => {
    setSaving(true);
    try {
      await editEvent(eventId, {
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location || undefined,
      });
      Alert.alert('Éxito', 'Actividad actualizada correctamente');
      goBack();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la actividad');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen />;
  if (!event) {
    return (
      <View style={styles.container}>
        <Loading message="Actividad no encontrada" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <EventForm
        initialValues={{
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location || '',
        }}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  backBtn: {
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
    padding: spacing.xs,
  },
  backArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 34,
  },
});

export default EditEventScreen;
