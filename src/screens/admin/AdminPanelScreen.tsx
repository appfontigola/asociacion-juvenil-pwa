import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { AppUser } from '../../types';
import { getAllUsers, toggleUserActive } from '../../services/userService';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const AdminPanelScreen: React.FC = () => {
  const { navigate, goBack } = useNav();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      await toggleUserActive(userId, !currentActive);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, active: !currentActive } : u
        )
      );
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    }
  };

  const adminActions = [
    { title: 'Crear usuario', icon: '👤', route: 'CreateUser' as const, desc: 'Añadir nuevo miembro' },
    { title: 'Gestionar avisos', icon: '📢', route: 'AdminNotices' as const, desc: 'Crear y administrar avisos' },
    { title: 'Gestionar actividades', icon: '📅', route: 'AdminEvents' as const, desc: 'Crear y administrar eventos' },
    { title: 'Asistencia', icon: '✅', route: 'AttendanceOverview' as const, desc: 'Ver quién asiste a cada evento' },
    { title: 'Cuotas', icon: '💰', route: 'Payments' as const, desc: 'Gestionar pagos de cuota anual' },
    { title: 'QR entrada/salida', icon: '📱', route: 'QRCheckin' as const, desc: 'Mostrar QR para escanear al llegar' },
    { title: 'Registro local', icon: '📋', route: 'LocalLog' as const, desc: 'Historial de entradas y salidas' },
    { title: 'Registro llaves', icon: '🔑', route: 'KeysLog' as const, desc: 'Recogida y devolución de llaves' },
  ];

  if (loading) return <Loading fullScreen message="Cargando panel..." />;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={adminActions}
      keyExtractor={(item) => item.route}
      ListHeaderComponent={() => (
        <>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Panel de Administración</Text>
          <Text style={styles.sectionTitle}>Acciones rápidas</Text>
        </>
      )}
      renderItem={({ item }) => (
        <Card
          style={styles.actionCard}
          onPress={() => navigate(item.route)}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>{item.icon}</Text>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{item.title}</Text>
              <Text style={styles.actionDesc}>{item.desc}</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </View>
        </Card>
      )}
      ListFooterComponent={() => (
        <>
          <Text style={styles.sectionTitle}>Usuarios ({users.length})</Text>
          {users.map((u) => (
            <Card key={u.id} style={styles.userCard}>
              <View style={styles.userContent}>
                <Avatar name={u.displayName} size={40} />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{u.displayName}</Text>
                  <Text style={styles.userEmail}>{u.email}</Text>
                </View>
                <Badge
                  label={u.role === 'admin' ? 'Admin' : 'User'}
                  variant={u.role === 'admin' ? 'primary' : 'info'}
                  size="sm"
                />
              </View>
              <View style={styles.userActions}>
                <TouchableOpacity
                  style={styles.userActionBtn}
                  onPress={() => navigate('EditUser', { userId: u.id })}
                >
                  <Text style={styles.userActionText}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.userActionBtn,
                    u.active ? styles.deactivateBtn : styles.activateBtn,
                  ]}
                  onPress={() => handleToggleActive(u.id, u.active)}
                >
                  <Text
                    style={[
                      styles.userActionText,
                      { color: u.active ? colors.warning : colors.success },
                    ]}
                  >
                    {u.active ? 'Desactivar' : 'Activar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))}
        </>
      )}
    />
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
  backBtn: {
    marginBottom: spacing.xs,
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
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  actionCard: {
    marginBottom: spacing.sm,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  actionDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  arrow: {
    fontSize: 24,
    color: colors.textMuted,
  },
  userCard: {
    marginBottom: spacing.sm,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  userInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  userName: {
    ...typography.body,
    fontWeight: '600',
  },
  userEmail: {
    ...typography.caption,
    color: colors.textMuted,
  },
  userActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
  },
  userActionBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
  },
  userActionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  deactivateBtn: {
    backgroundColor: colors.warning + '15',
  },
  activateBtn: {
    backgroundColor: colors.success + '15',
  },
});

export default AdminPanelScreen;
