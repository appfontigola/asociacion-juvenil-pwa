import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import NoticeForm from '../../components/notices/NoticeForm';
import Loading from '../../components/ui/Loading';
import { useNotices } from '../../hooks/useNotices';
import { Notice } from '../../types';
import { colors, spacing } from '../../constants/theme';

const EditNoticeScreen: React.FC = () => {
  const { goBack, routeParams } = useNav();
  const { noticeId } = routeParams;
  const { getNotice, editNotice } = useNotices();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getNotice(noticeId);
      setNotice(data);
      setLoading(false);
    };
    load();
  }, [noticeId, getNotice]);

  const handleSubmit = async (data: { title: string; description: string }) => {
    setSaving(true);
    try {
      await editNotice(noticeId, data);
      Alert.alert('Éxito', 'Aviso actualizado correctamente');
      goBack();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el aviso');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen />;
  if (!notice) {
    return (
      <View style={styles.container}>
        <Loading message="Aviso no encontrado" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <NoticeForm
        initialValues={{ title: notice.title, description: notice.description }}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
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
});

export default EditNoticeScreen;
