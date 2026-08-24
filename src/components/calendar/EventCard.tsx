import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Event } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';
import { formatDate } from '../../utils/helpers';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  attendanceCount?: number;
}

const EventCard: React.FC<EventCardProps> = ({ event, onPress, attendanceCount }) => {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();

  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {event.title}
        </Text>
        {isPast && <Badge label="Pasado" variant="warning" size="sm" />}
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>{formatDate(eventDate)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>⏰</Text>
          <Text style={styles.detailText}>{event.time}</Text>
        </View>
        {event.location && (
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        )}
      </View>
      {attendanceCount !== undefined && (
        <View style={styles.footer}>
          <Text style={styles.attendanceText}>
            {attendanceCount} asistentes
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing.sm,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  details: {
    marginBottom: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: spacing.sm,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  attendanceText: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
  },
});

export default EventCard;
