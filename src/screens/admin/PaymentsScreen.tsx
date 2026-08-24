import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNav } from '../../navigation/NavContext';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { Payment, getPaymentsByYear, setPayment } from '../../services/paymentService';
import { AppUser } from '../../types';
import { getAllUsers } from '../../services/userService';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDate } from '../../utils/helpers';

const PaymentsScreen: React.FC = () => {
  const { goBack } = useNav();
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [users, setUsers] = useState<AppUser[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoadingUsers(true);
    setLoadingPayments(true);
    try {
      const [allUsers, yearPayments] = await Promise.all([
        getAllUsers(),
        getPaymentsByYear(year),
      ]);
      setUsers(allUsers.filter((u) => u.active));
      setPayments(yearPayments);
    } catch {
      // Silently fail
    } finally {
      setLoadingUsers(false);
      setLoadingPayments(false);
    }
  }, [year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPaymentStatus = (userId: string): Payment | undefined =>
    payments.find((p) => p.userId === userId);

  const handleToggle = async (user: AppUser, currentStatus: Payment | undefined) => {
    const newPaid = !currentStatus?.paid;
    setToggling(user.id);
    try {
      await setPayment(user.id, user.displayName, year, newPaid);
      setPayments((prev) => {
        const filtered = prev.filter((p) => p.userId !== user.id);
        return [
          ...filtered,
          {
            userId: user.id,
            userName: user.displayName,
            year,
            paid: newPaid,
            paidAt: newPaid ? new Date() : null,
          },
        ];
      });
    } catch {
      // Silently fail
    } finally {
      setToggling(null);
    }
  };

  const sortedUsers = [...users].sort((a, b) => a.displayName.localeCompare(b.displayName));

  const paidCount = users.filter((u) => getPaymentStatus(u.id)?.paid).length;
  const progress = users.length > 0 ? Math.round((paidCount / users.length) * 100) : 0;

  const refreshing = loadingUsers || loadingPayments;

  const renderUser = ({ item }: { item: AppUser }) => {
    const status = getPaymentStatus(item.id);
    const isPaid = status?.paid ?? false;

    return (
      <Card style={styles.userCard}>
        <TouchableOpacity
          style={styles.userRow}
          onPress={() => handleToggle(item, status)}
          disabled={toggling === item.id}
          activeOpacity={0.7}
        >
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.displayName}</Text>
            {isPaid && status?.paidAt && (
              <Text style={styles.paidDate}>Pagado el {formatDate(new Date(status.paidAt))}</Text>
            )}
          </View>
          <Badge
            label={isPaid ? 'Pagado' : 'Pendiente'}
            variant={isPaid ? 'success' : 'danger'}
            size="md"
          />
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Cuotas</Text>
      </View>

      <View style={styles.yearRow}>
        <TouchableOpacity onPress={() => setYear((y) => y - 1)} style={styles.yearArrow}>
          <Text style={styles.yearArrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.yearText}>{year}</Text>
        <TouchableOpacity
          onPress={() => setYear((y) => y + 1)}
          style={styles.yearArrow}
        >
          <Text style={styles.yearArrowText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {paidCount} / {users.length} usuarios ({progress}%)
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {refreshing && users.length === 0 ? (
        <Loading fullScreen message="Cargando..." />
      ) : (
        <FlatList
          data={sortedUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState title="Sin usuarios" message="No hay usuarios activos" />
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchData}
              tintColor={colors.primary}
              colors={[colors.primary]}
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
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  yearArrow: {
    padding: spacing.md,
  },
  yearArrowText: {
    fontSize: 28,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 30,
  },
  yearText: {
    ...typography.h2,
    marginHorizontal: spacing.xl,
  },
  progressRow: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  separator: {
    height: spacing.sm,
  },
  userCard: {
    padding: spacing.md,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  userName: {
    ...typography.body,
    fontWeight: '600',
  },
  paidDate: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default PaymentsScreen;
