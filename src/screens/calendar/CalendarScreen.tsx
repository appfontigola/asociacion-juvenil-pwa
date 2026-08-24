import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNav } from '../../navigation/NavContext';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import EventCard from '../../components/calendar/EventCard';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { useEvents } from '../../hooks/useEvents';
import { useAuth } from '../../hooks/useAuth';
import { Event } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

interface Section {
  title: string;
  data: Event[];
}

const CalendarScreen: React.FC = () => {
  const { navigate } = useNav();
  const { events, loading, fetchEvents } = useEvents();
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dayEvents, setDayEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return sortedEvents.filter((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return d >= now;
    });
  }, [sortedEvents]);

  const sections: Section[] = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    upcomingEvents.forEach((e) => {
      const d = new Date(e.date);
      const key = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(e);
    });
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [upcomingEvents]);

  const handleDayPress = (date: Date, dayEvts: Event[]) => {
    setSelectedDate(date);
    setDayEvents(dayEvts);
  };

  if (loading && events.length === 0) {
    return <Loading fullScreen message="Cargando actividades..." />;
  }

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      onPress={() => navigate('EventDetail', { eventId: item.id })}
    />
  );

  const renderSectionHeader = ({ section }: { section: Section }) => (
    <Text style={styles.sectionHeader}>{section.title}</Text>
  );

  const formatDayMonth = (date: Date) => {
    const day = date.getDate();
    const month = MONTHS[date.getMonth()];
    return `${day} de ${month}`;
  };

  const ListHeaderComponent = () => (
    <View style={styles.listHeader}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Home')} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Calendario</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigate('CreateEvent')}
          >
            <Text style={styles.addButtonText}>+ Nueva</Text>
          </TouchableOpacity>
        )}
      </View>

      <CalendarGrid
        events={events}
        onDayPress={handleDayPress}
        selectedDate={selectedDate}
      />

      {selectedDate && dayEvents.length > 0 && (
        <View style={styles.dayEventsSection}>
          <Text style={styles.sectionHeader}>
            {formatDayMonth(selectedDate)}
          </Text>
          {dayEvents.map((e) => (
            <View key={e.id} style={styles.dayEventItem}>
              <EventCard
                event={e}
                onPress={() => navigate('EventDetail', { eventId: e.id })}
              />
            </View>
          ))}
        </View>
      )}

      {selectedDate && dayEvents.length === 0 && (
        <Text style={styles.noEvents}>Sin actividades este día</Text>
      )}

      {upcomingEvents.length > 0 && (
        <Text style={[styles.sectionHeader, styles.upcomingTitle]}>
          Próximas actividades
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              title="No hay actividades"
              message="No hay actividades programadas aún"
            />
          ) : null
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchEvents}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        stickySectionHeadersEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  backBtn: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  backArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 34,
  },
  title: {
    ...typography.h1,
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
  },
  addButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  listHeader: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    ...typography.h3,
    color: colors.accent,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  upcomingTitle: {
    color: colors.accent,
    marginTop: spacing.lg,
  },
  dayEventsSection: {
    marginBottom: spacing.sm,
  },
  dayEventItem: {
    marginBottom: spacing.md,
  },
  noEvents: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  separator: {
    height: spacing.md,
  },
});

export default CalendarScreen;
