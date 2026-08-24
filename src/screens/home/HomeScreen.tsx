import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import { useAuth } from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface QuickAction {
  title: string;
  icon: string;
  route: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { title: 'Avisos', icon: '📢', route: 'NoticesTab' },
  { title: 'Calendario', icon: '📅', route: 'CalendarTab' },
  { title: 'Local', icon: '📍', route: 'LocalTab' },
  { title: 'Perfil', icon: '👤', route: 'ProfileTab' },
];

const HomeScreen: React.FC = () => {
  const { navigate } = useNav();
  const { user, isAdmin } = useAuth();

  const today = new Date();
  const greeting = (() => {
    const h = today.getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  })();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.welcomeSection}>
        <Avatar name={user?.displayName || 'U'} size={60} />
        <View style={styles.welcomeText}>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.userName}>{user?.displayName}</Text>
          {isAdmin && <Text style={styles.adminBadge}>Administrador</Text>}
        </View>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Acceso rápido</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((action) => (
            <Card
              key={action.route}
              style={styles.actionCard}
              onPress={() => navigate(action.route)}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </Card>
          ))}
        </View>
      </View>

      {isAdmin && (
        <View style={styles.adminSection}>
          <Text style={styles.sectionTitle}>Panel de Administración</Text>
          <Card
            style={styles.adminCard}
            onPress={() => navigate('AdminPanel')}
          >
            <View style={styles.adminCardContent}>
              <Text style={styles.adminIcon}>⚙️</Text>
              <View style={styles.adminTextContent}>
                <Text style={styles.adminTitle}>Administrar</Text>
                <Text style={styles.adminDesc}>
                  Gestiona usuarios, avisos y actividades
                </Text>
              </View>
              <Text style={styles.adminArrow}>›</Text>
            </View>
          </Card>
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
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  welcomeText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  greeting: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  userName: {
    ...typography.h2,
    marginTop: 2,
  },
  adminBadge: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    ...typography.h3,
    marginBottom: spacing.md,
  },
  quickActions: {
    marginBottom: spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  adminSection: {},
  adminCard: {
    padding: spacing.md,
  },
  adminCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  adminTextContent: {
    flex: 1,
  },
  adminTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  adminDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  adminArrow: {
    fontSize: 24,
    color: colors.textMuted,
  },
});

export default HomeScreen;
