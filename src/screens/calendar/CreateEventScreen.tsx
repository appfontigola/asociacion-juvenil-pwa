import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import EventForm from '../../components/calendar/EventForm';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing } from '../../constants/theme';

const CreateEventScreen: React.FC = () => {
  const { goBack } = useNav();
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: {
    title: string;
    description: string;
    date: Date;
    time: string;
    location: string;
  }) => {
    if (!user) return;
    setLoading(true);
    try {
      await createEvent({
        title: data.title,
        description: data.description,
        date: data.date,
        time: data.time,
        location: data.location || undefined,
        authorId: user.id,
        authorName: user.displayName,
      });
      Alert.alert('Éxito', 'Actividad creada correctamente');
      goBack();
    } catch {
      Alert.alert('Error', 'No se pudo crear la actividad');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <EventForm onSubmit={handleSubmit} loading={loading} />
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

export default CreateEventScreen;
