import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import UserPresenceCard from '../../components/local/UserPresenceCard';
import EmptyState from '../../components/ui/EmptyState';
import Loading from '../../components/ui/Loading';
import { useLocalPresence } from '../../hooks/useLocalPresence';
import { useLocalKeys } from '../../hooks/useLocalKeys';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const LocalScreen: React.FC = () => {
  const { navigate } = useNav();
  const { activeUsers, loading: loadingPresence, enterLocal, leaveLocal } = useLocalPresence();
  const { keyHolders, loading: loadingKeys, takeKeys, returnKeys } = useLocalKeys();
  const { user } = useAuth();
  const [togglingPresence, setTogglingPresence] = useState(false);
  const [togglingKeys, setTogglingKeys] = useState(false);

  const isUserHere = user ? activeUsers.some((u) => u.userId === user.id) : false;
  const userHasKeys = user ? keyHolders.some((u) => u.userId === user.id) : false;

  const handleTogglePresence = async () => {
    if (!user) return;
    setTogglingPresence(true);
    try {
      if (isUserHere) {
        await leaveLocal(user.id);
      } else {
        await enterLocal(user.id, user.displayName);
      }
    } finally {
      setTogglingPresence(false);
    }
  };

  const handleToggleKeys = async () => {
    if (!user) return;
    setTogglingKeys(true);
    try {
      if (userHasKeys) {
        await returnKeys(user.id);
      } else {
        await takeKeys(user.id, user.displayName);
      }
    } finally {
      setTogglingKeys(false);
    }
  };

  if (loadingPresence || loadingKeys) return <Loading fullScreen message="Cargando..." />;

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <TouchableOpacity onPress={() => navigate('Home')} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Local</Text>
        <Text style={styles.subtitle}>
          {activeUsers.length} persona{activeUsers.length !== 1 ? 's' : ''} en el local
          {' · '}
          {keyHolders.length} llave{keyHolders.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={[0]}
        keyExtractor={() => 'list'}
        showsVerticalScrollIndicator={false}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <>
            <Card style={styles.toggleCard}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleIcon}>📍</Text>
                <View style={styles.toggleText}>
                  <Text style={styles.toggleTitle}>¿Estás en el local?</Text>
                  <Text style={styles.toggleDesc}>
                    {isUserHere
                      ? 'Presiona para salir de la lista'
                      : 'Presiona para aparecer en la lista'}
                  </Text>
                </View>
              </View>
              <Button
                title={isUserHere ? 'Salir del local' : 'Estoy en el local'}
                onPress={handleTogglePresence}
                variant={isUserHere ? 'danger' : 'primary'}
                loading={togglingPresence}
                size="lg"
              />
            </Card>

            <Card style={styles.toggleCard}>
              <View style={styles.toggleContent}>
                <Text style={styles.toggleIcon}>🔑</Text>
                <View style={styles.toggleText}>
                  <Text style={styles.toggleTitle}>¿Tienes las llaves?</Text>
                  <Text style={styles.toggleDesc}>
                    {userHasKeys
                      ? 'Presiona para devolver las llaves'
                      : 'Presiona para indicar que tienes las llaves'}
                  </Text>
                </View>
              </View>
              <Button
                title={userHasKeys ? 'Devolver llaves' : 'Tengo las llaves'}
                onPress={handleToggleKeys}
                variant={userHasKeys ? 'danger' : 'primary'}
                loading={togglingKeys}
                size="lg"
              />
            </Card>

            <Text style={styles.listTitle}>Personas en el local</Text>

            {activeUsers.length === 0 ? (
              <View style={styles.listPadding}>
                <EmptyState
                  title="No hay nadie"
                  message="Parece que no hay nadie en el local ahora"
                />
              </View>
            ) : (
              <View style={styles.listPadding}>
                {activeUsers.map((item) => (
                  <UserPresenceCard key={item.userId} user={item} />
                ))}
              </View>
            )}

            <Text style={styles.listTitle}>Personas con llaves</Text>

            {keyHolders.length === 0 ? (
              <View style={styles.listPadding}>
                <EmptyState
                  title="Nadie tiene llaves"
                  message="Marca si tienes las llaves del local"
                />
              </View>
            ) : (
              <View style={styles.listPadding}>
                {keyHolders.map((item) => (
                  <UserPresenceCard key={item.userId} user={item} />
                ))}
              </View>
            )}
          </>
        )}
        contentContainerStyle={styles.scrollContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerSection: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
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
    ...typography.h1,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  toggleCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  toggleIcon: {
    fontSize: 36,
    marginRight: spacing.md,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    ...typography.body,
    fontWeight: '600',
  },
  toggleDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  listTitle: {
    ...typography.h3,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  listPadding: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
});

export default LocalScreen;
