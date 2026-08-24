import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNav } from '../../navigation/NavContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import AttendanceButton from '../../components/calendar/AttendanceButton';
import { useEvents, useAttendance } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { Event, AttendanceStatus } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDate, getAttendanceLabel, getAttendanceColor } from '../../utils/helpers';

const EventDetailScreen: React.FC = () => {
  const { navigate, goBack, routeParams } = useNav();
  const { eventId } = routeParams;
  const { getEvent, removeEvent } = useEvents();
  const { user, isAdmin } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const { attendances, counts, setStatus } = useAttendance(eventId);

  useEffect(() => {
    const load = async () => {
      const data = await getEvent(eventId);
      setEvent(data);
      setLoading(false);
    };
    load();
  }, [eventId, getEvent]);

  const handleAttendance = async (status: AttendanceStatus) => {
    if (!user) return;
    try {
      await setStatus(user.id, user.displayName, status);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar tu asistencia');
    }
  };

  const handleDelete = () => {
    Alert.alert('Eliminar actividad', '¿Estás seguro?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeEvent(eventId);
            goBack();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la actividad');
          }
        },
      },
    ]);
  };

  if (loading) return <Loading fullScreen />;
  if (!event) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Actividad no encontrada</Text>
      </View>
    );
  }

  const eventDate = new Date(event.date);
  const userStatus = user ? attendances.find((a) => a.userId === user.id)?.status || null : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <Card variant="elevated">
        <Text style={styles.title}>{event.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.author}>{event.authorName}</Text>
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Fecha</Text>
            <Text style={styles.detailValue}>{formatDate(eventDate)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>⏰ Hora</Text>
            <Text style={styles.detailValue}>{event.time}</Text>
          </View>
          {event.location && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📍 Ubicación</Text>
              <Text style={styles.detailValue}>{event.location}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />
        <Text style={styles.description}>{event.description}</Text>
      </Card>

      <View style={styles.attendanceSection}>
        <Text style={styles.sectionTitle}>Mi asistencia</Text>
        <AttendanceButton
          currentStatus={userStatus}
          onSelectStatus={handleAttendance}
        />
      </View>

      <View style={styles.countsSection}>
        <Text style={styles.sectionTitle}>Resumen</Text>
        <View style={styles.countsRow}>
          <View style={[styles.countCard, { borderColor: colors.success }]}>
            <Text style={[styles.countNumber, { color: colors.success }]}>
              {counts.going}
            </Text>
            <Text style={styles.countLabel}>Asistirán</Text>
          </View>
          <View style={[styles.countCard, { borderColor: colors.error }]}>
            <Text style={[styles.countNumber, { color: colors.error }]}>
              {counts.notGoing}
            </Text>
            <Text style={styles.countLabel}>No asistirán</Text>
          </View>
          <View style={[styles.countCard, { borderColor: colors.warning }]}>
            <Text style={[styles.countNumber, { color: colors.warning }]}>
              {counts.undecided}
            </Text>
            <Text style={styles.countLabel}>No lo saben</Text>
          </View>
        </View>
      </View>

      {attendances.length > 0 && (
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Asistentes</Text>
          {attendances
            .filter((a) => a.status === 'going')
            .map((a) => (
              <View key={a.id} style={styles.attendeeRow}>
                <Text style={styles.attendeeName}>{a.userName}</Text>
                <Badge
                  label={getAttendanceLabel(a.status)}
                  variant={
                    a.status === 'going' ? 'success' : a.status === 'not_going' ? 'danger' : 'warning'
                  }
                  size="sm"
                />
              </View>
            ))}
        </View>
      )}

      {isAdmin && (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigate('EditEvent', { eventId })}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  title: {
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  meta: {
    marginBottom: spacing.md,
  },
  author: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  detailsSection: {
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  detailLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  detailValue: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  attendanceSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  countsSection: {
    marginTop: spacing.lg,
  },
  countsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  countCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  countLabel: {
    ...typography.caption,
    marginTop: 4,
    color: colors.textSecondary,
  },
  listSection: {
    marginTop: spacing.lg,
  },
  attendeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  attendeeName: {
    ...typography.body,
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  backArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 34,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: 48,
  },
  adminActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.error + '20',
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default EventDetailScreen;
