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
import NoticeCard from '../../components/notices/NoticeCard';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { useNotices } from '../../hooks/useNotices';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing, typography } from '../../constants/theme';

const NoticesListScreen: React.FC = () => {
  const { navigate } = useNav();
  const { notices, loading, fetchNotices } = useNotices();
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  if (loading && notices.length === 0) {
    return <Loading fullScreen message="Cargando avisos..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigate('Home')} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Avisos</Text>
        {isAdmin && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigate('CreateNotice')}
          >
            <Text style={styles.addButtonText}>+ Nuevo</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoticeCard
            notice={item}
            onPress={() => navigate('NoticeDetail', { noticeId: item.id })}
            isAdmin={isAdmin}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No hay avisos"
            message="Próximamente encontrarás novedades aquí"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchNotices}
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
  separator: {
    height: spacing.md,
  },
});

export default NoticesListScreen;
