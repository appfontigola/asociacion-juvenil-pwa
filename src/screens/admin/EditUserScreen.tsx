import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import UserForm from '../../components/admin/UserForm';
import Loading from '../../components/ui/Loading';
import { getUserById, updateUser } from '../../services/userService';
import { sendPasswordResetEmail } from '../../services/authService';
import { AppUser } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';

const EditUserScreen: React.FC = () => {
  const { goBack, routeParams } = useNav();
  const { userId } = routeParams;
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getUserById(userId);
      setUser(data);
      setLoading(false);
    };
    load();
  }, [userId]);

  const handleSubmit = async (data: {
    email: string;
    password: string;
    displayName: string;
    role: 'admin' | 'user';
  }) => {
    setSaving(true);
    try {
      await updateUser(userId, {
        displayName: data.displayName,
        role: data.role,
      });
      if (data.password) {
        await sendPasswordResetEmail(user!.email);
        Alert.alert(
          'Usuario actualizado',
          'Los cambios se guardaron. Se ha enviado un correo de restablecimiento de contraseña al usuario.'
        );
      } else {
        Alert.alert('Éxito', 'Usuario actualizado correctamente');
      }
      goBack();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el usuario');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading fullScreen />;
  if (!user) {
    return (
      <View style={styles.container}>
        <Loading message="Usuario no encontrado" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <UserForm
        initialValues={{
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        }}
        onSubmit={handleSubmit}
        loading={saving}
        isEditing
      />
      <Text style={styles.passwordNote}>
        Si escribes una nueva contraseña, se enviará un correo de restablecimiento al usuario.
      </Text>
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
    marginBottom: 8,
    alignSelf: 'flex-start',
    padding: 4,
  },
  backArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 34,
  },
  passwordNote: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default EditUserScreen;
