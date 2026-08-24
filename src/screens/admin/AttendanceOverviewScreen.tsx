import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  RefreshControl,
} from 'react-native';
import { useNav } from '../../navigation/NavContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { Event, EventAttendance, AppUser } from '../../types';
import { useEvents } from '../../hooks/useEvents';
import { getAttendanceByEvent } from '../../services/attendanceService';
import { getAllUsers } from '../../services/userService';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDate } from '../../utils/helpers';

interface EventWithAttendance extends Event {
  attendances: EventAttendance[];
  counts: { going: number; notGoing: number; undecided: number };
}

interface UserAttendance {
  userId: string;
  userName: string;
  events: { eventId: string; eventTitle: string; eventDate: Date; status: string }[];
}

type ViewMode = 'events' | 'users';

const AttendanceOverviewScreen: React.FC = () => {
  const { goBack } = useNav();
  const { events, loading, fetchEvents } = useEvents();
  const [eventsWithAttendance, setEventsWithAttendance] = useState<EventWithAttendance[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('events');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showUserPicker, setShowUserPicker] = useState(false);

  const loadAttendance = useCallback(async () => {
    if (events.length === 0) return;
    setLoadingAttendance(true);
    try {
      const results = await Promise.all(
        events.map(async (event) => {
          const attendances = await getAttendanceByEvent(event.id);
          return {
            ...event,
            attendances,
            counts: {
              going: attendances.filter((a) => a.status === 'going').length,
              notGoing: attendances.filter((a) => a.status === 'not_going').length,
              undecided: attendances.filter((a) => a.status === 'undecided').length,
            },
          };
        })
      );
      setEventsWithAttendance(results);
    } catch {
      // Silently fail
    } finally {
      setLoadingAttendance(false);
    }
  }, [events]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      try {
        const users = await getAllUsers();
        setAllUsers(users);
      } catch {
        // Silently fail
      } finally {
        setLoadingUsers(false);
      }
    };
    loadUsers();
  }, []);

  const sortedEvents = useMemo(
    () =>
      [...eventsWithAttendance].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    [eventsWithAttendance]
  );

  const usersAttendance = useMemo(() => {
    const userMap: Record<string, UserAttendance> = {};

    allUsers.forEach((u) => {
      userMap[u.id] = { userId: u.id, userName: u.displayName, events: [] };
    });

    eventsWithAttendance.forEach((event) => {
      event.attendances.forEach((att) => {
        if (!userMap[att.userId]) {
          userMap[att.userId] = { userId: att.userId, userName: att.userName, events: [] };
        }
        userMap[att.userId].events.push({
          eventId: event.id,
          eventTitle: event.title,
          eventDate: new Date(event.date),
          status: att.status,
        });
      });
    });

    return Object.values(userMap).map((user) => ({
      ...user,
      events: user.events.sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime()),
    }));
  }, [eventsWithAttendance, allUsers]);

  const sortedUsers = useMemo(
    () => [...usersAttendance].sort((a, b) => a.userName.localeCompare(b.userName)),
    [usersAttendance]
  );

  const selectedUser = useMemo(
    () => usersAttendance.find((u) => u.userId === selectedUserId) ?? null,
    [usersAttendance, selectedUserId]
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'going':
        return { label: 'Asistirá', variant: 'success' as const };
      case 'not_going':
        return { label: 'No asistirá', variant: 'danger' as const };
      case 'undecided':
        return { label: 'Sin decidir', variant: 'warning' as const };
      default:
        return { label: status, variant: 'info' as const };
    }
  };

  const renderEvent = ({ item }: { item: EventWithAttendance }) => {
    const isExpanded = expandedId === item.id;

    return (
      <Card style={styles.eventCard}>
        <TouchableOpacity
          onPress={() => setExpandedId(isExpanded ? null : item.id)}
          activeOpacity={0.7}
        >
          <View style={styles.eventHeader}>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.eventDate}>
                {formatDate(new Date(item.date))} · {item.time}
              </Text>
            </View>
            <Text style={styles.expandArrow}>{isExpanded ? '▲' : '▼'}</Text>
          </View>

          <View style={styles.countsRow}>
            <View style={[styles.countChip, { backgroundColor: colors.success + '20' }]}>
              <Text style={[styles.countNumber, { color: colors.success }]}>✅ {item.counts.going}</Text>
            </View>
            <View style={[styles.countChip, { backgroundColor: colors.error + '20' }]}>
              <Text style={[styles.countNumber, { color: colors.error }]}>❌ {item.counts.notGoing}</Text>
            </View>
            <View style={[styles.countChip, { backgroundColor: colors.warning + '20' }]}>
              <Text style={[styles.countNumber, { color: colors.warning }]}>❓ {item.counts.undecided}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.attendeesSection}>
            <View style={styles.divider} />
            {item.attendances.length === 0 ? (
              <Text style={styles.noAttendees}>Sin respuestas aún</Text>
            ) : (
              <>
                {item.attendances
                  .sort((a, b) => {
                    const order = { going: 0, undecided: 1, not_going: 2 };
                    return (order[a.status] ?? 0) - (order[b.status] ?? 0);
                  })
                  .map((att) => {
                    const badge = getStatusBadge(att.status);
                    return (
                      <View key={att.id} style={styles.attendeeRow}>
                        <Text style={styles.attendeeName}>{att.userName}</Text>
                        <Badge label={badge.label} variant={badge.variant} size="sm" />
                      </View>
                    );
                  })}
              </>
            )}
          </View>
        )}
      </Card>
    );
  };

  const renderUser = ({ item }: { item: UserAttendance }) => (
    <Card style={styles.eventCard}>
      <View style={styles.userHeader}>
        <Text style={styles.userAvatar}>{item.userName.charAt(0).toUpperCase()}</Text>
        <Text style={styles.userNameTitle}>{item.userName}</Text>
        <Text style={styles.userEventCount}>{item.events.length} eventos</Text>
      </View>
      <View style={styles.divider} />
      {item.events.length === 0 ? (
        <Text style={styles.noAttendees}>Sin respuestas a eventos</Text>
      ) : (
        item.events.map((evt) => {
          const badge = getStatusBadge(evt.status);
          return (
            <View key={evt.eventId} style={styles.userEventRow}>
              <View style={styles.userEventInfo}>
                <Text style={styles.userEventTitle}>{evt.eventTitle}</Text>
                <Text style={styles.userEventDate}>{formatDate(evt.eventDate)}</Text>
              </View>
              <Badge label={badge.label} variant={badge.variant} size="sm" />
            </View>
          );
        })
      )}
    </Card>
  );

  const refreshing = loading || loadingAttendance || loadingUsers;

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Asistencia</Text>
      </View>

      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'events' && styles.tabActive]}
          onPress={() => setViewMode('events')}
        >
          <Text style={[styles.tabText, viewMode === 'events' && styles.tabTextActive]}>
            Por evento
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, viewMode === 'users' && styles.tabActive]}
          onPress={() => setViewMode('users')}
        >
          <Text style={[styles.tabText, viewMode === 'users' && styles.tabTextActive]}>
            Por usuario
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'users' && (
        <>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowUserPicker(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.pickerButtonText,
                !selectedUser && styles.pickerButtonPlaceholder,
              ]}
            >
              {selectedUser ? selectedUser.userName : 'Seleccionar usuario...'}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>

          <Modal
            visible={showUserPicker}
            transparent
            animationType="fade"
            onRequestClose={() => setShowUserPicker(false)}
          >
            <TouchableOpacity
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowUserPicker(false)}
            >
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Seleccionar usuario</Text>
                <FlatList
                  data={sortedUsers}
                  keyExtractor={(item) => item.userId}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.modalUserRow,
                        item.userId === selectedUserId && styles.modalUserRowActive,
                      ]}
                      onPress={() => {
                        setSelectedUserId(item.userId);
                        setShowUserPicker(false);
                      }}
                    >
                      <Text style={styles.modalUserName}>{item.userName}</Text>
                      <Text style={styles.modalUserCount}>
                        {item.events.length} eventos
                      </Text>
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
                />
              </View>
            </TouchableOpacity>
          </Modal>
        </>
      )}
    </>
  );

  if (refreshing && eventsWithAttendance.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <Loading fullScreen message="Cargando asistencia..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {viewMode === 'events' ? (
        <FlatList
          data={sortedEvents}
          keyExtractor={(item) => item.id}
          renderItem={renderEvent}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="No hay actividades"
              message="Crea actividades para ver la asistencia"
            />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                fetchEvents();
                loadAttendance();
              }}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <FlatList
          data={selectedUser ? [selectedUser] : []}
          keyExtractor={(item) => item.userId}
          renderItem={renderUser}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState
              title="Selecciona un usuario"
              message="Toca el selector de arriba para ver la asistencia de un usuario"
            />
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
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
    marginRight: spacing.md,
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
  },
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md - 2,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.text,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  pickerButtonPlaceholder: {
    color: colors.textMuted,
  },
  pickerArrow: {
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    maxHeight: '70%',
    padding: spacing.md,
  },
  modalTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalUserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  modalUserRowActive: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.sm,
  },
  modalUserName: {
    ...typography.body,
    fontWeight: '500',
  },
  modalUserCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  modalSeparator: {
    height: 1,
    backgroundColor: colors.border,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  separator: {
    height: spacing.md,
  },
  eventCard: {
    padding: spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  eventTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventDate: {
    ...typography.caption,
    color: colors.textMuted,
  },
  expandArrow: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  countsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  countChip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  countNumber: {
    fontSize: 13,
    fontWeight: '600',
  },
  attendeesSection: {
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  noAttendees: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: spacing.md,
  },
  attendeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm - 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '60',
  },
  attendeeName: {
    ...typography.bodySmall,
    fontWeight: '500',
    flex: 1,
    marginRight: spacing.sm,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
    marginRight: spacing.md,
    overflow: 'hidden',
  },
  userNameTitle: {
    ...typography.body,
    fontWeight: '600',
    flex: 1,
  },
  userEventCount: {
    ...typography.caption,
    color: colors.textMuted,
  },
  userEventRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm - 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '60',
  },
  userEventInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  userEventTitle: {
    ...typography.bodySmall,
    fontWeight: '500',
  },
  userEventDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 1,
  },
});

export default AttendanceOverviewScreen;
