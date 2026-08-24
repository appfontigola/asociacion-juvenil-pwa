import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import NoticeForm from '../../components/notices/NoticeForm';
import { useNotices } from '../../hooks/useNotices';
import { useAuth } from '../../hooks/useAuth';
import { colors, spacing } from '../../constants/theme';

const CreateNoticeScreen: React.FC = () => {
  const { goBack } = useNav();
  const { createNotice } = useNotices();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: { title: string; description: string }) => {
    if (!user) return;
    setLoading(true);
    try {
      await createNotice({
        title: data.title,
        description: data.description,
        authorId: user.id,
        authorName: user.displayName,
      });
      Alert.alert('Éxito', 'Aviso publicado correctamente');
      goBack();
    } catch (err) {
      Alert.alert('Error', 'No se pudo publicar el aviso');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <NoticeForm onSubmit={handleSubmit} loading={loading} />
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

export default CreateNoticeScreen;
