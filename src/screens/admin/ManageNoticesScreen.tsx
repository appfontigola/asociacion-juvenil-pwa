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
import { colors, spacing, typography } from '../../constants/theme';

const ManageNoticesScreen: React.FC = () => {
  const { navigate } = useNav();
  const { notices, loading, fetchNotices } = useNotices();

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  if (loading && notices.length === 0) {
    return <Loading fullScreen message="Cargando avisos..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestionar avisos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigate('CreateNoticeAdmin')}
        >
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoticeCard
            notice={item}
            isAdmin
            onPress={() =>
              navigate('EditNoticeAdmin', { noticeId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            title="No hay avisos"
            message="Crea el primer aviso"
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

export default ManageNoticesScreen;
