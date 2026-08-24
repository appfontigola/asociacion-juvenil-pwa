import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { getLocalLog, LocalLogEntry } from '../../services/localService';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const LocalLogScreen: React.FC = () => {
  const { goBack } = useNav();
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState<LocalLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getLocalLog(date).then((data) => {
      setEntries(data.sort((a, b) => (b.entryTime?.getTime() || 0) - (a.entryTime?.getTime() || 0)));
      setLoading(false);
    });
  }, [date]);

  const changeDay = (delta: number) => {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d.toISOString().split('T')[0]);
  };

  const formatTime = (d?: Date) => {
    if (!d) return '—';
    return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (d: string) => {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Registro local</Text>

      <View style={styles.dateNav}>
        <TouchableOpacity onPress={() => changeDay(-1)} style={styles.navBtn}>
          <Text style={styles.navBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.dateLabel}>{formatDate(date)}</Text>
        <TouchableOpacity onPress={() => changeDay(1)} style={styles.navBtn}>
          <Text style={styles.navBtnText}>›</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : entries.length === 0 ? (
        <Text style={styles.empty}>Sin registros este día</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.name}>{item.userName}</Text>
                <Text style={styles.time}>
                  Entrada: {formatTime(item.entryTime)}
                  {item.exitTime ? `  ·  Salida: ${formatTime(item.exitTime)}` : ''}
                </Text>
              </View>
              <View style={[styles.badge, { backgroundColor: item.exitTime ? '#22c55e' : '#f59e0b' }]}>
                <Text style={styles.badgeText}>{item.exitTime ? 'Completo' : 'Dentro'}</Text>
              </View>
            </Card>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
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
  title: {
    ...typography.h1,
    marginBottom: spacing.md,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  navBtn: {
    padding: 8,
  },
  navBtnText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
  },
  dateLabel: {
    ...typography.h3,
    color: '#fff',
    minWidth: 140,
    textAlign: 'center',
  },
  empty: {
    ...typography.bodySmall,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 40,
    fontStyle: 'italic',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    ...typography.body,
    color: '#fff',
    fontWeight: '500',
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default LocalLogScreen;
