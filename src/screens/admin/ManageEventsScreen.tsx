import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNav } from '../../navigation/NavContext';
import EventCard from '../../components/calendar/EventCard';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { useEvents } from '../../hooks/useEvents';
import { colors, spacing, typography } from '../../constants/theme';

const ManageEventsScreen: React.FC = () => {
  const { navigate } = useNav();
  const { events, loading, fetchEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  if (loading && events.length === 0) {
    return <Loading fullScreen message="Cargando actividades..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestionar actividades</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigate('CreateEventAdmin')}
        >
          <Text style={styles.addButtonText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() =>
              navigate('EditEventAdmin', { eventId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No hay actividades"
            message="Crea la primera actividad"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchEvents}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
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
  separator: {
    height: spacing.md,
  },
});

export default ManageEventsScreen;
