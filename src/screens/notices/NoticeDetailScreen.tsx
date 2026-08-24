import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNav } from '../../navigation/NavContext';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { useNotices } from '../../hooks/useNotices';
import { useAuth } from '../../hooks/useAuth';
import { Notice } from '../../types';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDateTime } from '../../utils/helpers';

const NoticeDetailScreen: React.FC = () => {
  const { navigate, goBack, routeParams } = useNav();
  const { noticeId } = routeParams;
  const { getNotice, removeNotice } = useNotices();
  const { isAdmin } = useAuth();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getNotice(noticeId);
      setNotice(data);
      setLoading(false);
    };
    load();
  }, [noticeId, getNotice]);

  const handleDelete = () => {
    Alert.alert(
      'Eliminar aviso',
      '¿Estás seguro de eliminar este aviso?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeNotice(noticeId);
              goBack();
            } catch {
              Alert.alert('Error', 'No se pudo eliminar el aviso');
            }
          },
        },
      ]
    );
  };

  if (loading) return <Loading fullScreen />;
  if (!notice) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Aviso no encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <Card variant="elevated">
        <Text style={styles.title}>{notice.title}</Text>
        <View style={styles.meta}>
          <Text style={styles.author}>{notice.authorName}</Text>
          <Text style={styles.date}>{formatDateTime(notice.createdAt)}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.description}>{notice.description}</Text>
      </Card>

      {isAdmin && (
        <View style={styles.adminActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigate('EditNotice', { noticeId })}
          >
            <Text style={styles.editButtonText}>Editar aviso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Eliminar</Text>
          </TouchableOpacity>
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
  title: {
    ...typography.h2,
    marginBottom: spacing.md,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  author: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '600',
  },
  date: {
    ...typography.caption,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: spacing.xs,
    marginBottom: spacing.sm,
  },
  backArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 34,
  },
  errorText: {
    ...typography.body,
    color: colors.error,
    textAlign: 'center',
    marginTop: 48,
  },
  adminActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: colors.error + '20',
    paddingVertical: spacing.md - 2,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: colors.error,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default NoticeDetailScreen;
