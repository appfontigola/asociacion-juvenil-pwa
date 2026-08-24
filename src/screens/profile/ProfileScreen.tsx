import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Card from '../../components/ui/Card';
import Avatar from '../../components/ui/Avatar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { useNav } from '../../navigation/NavContext';
import { useAuth } from '../../hooks/useAuth';
import { changePassword } from '../../services/authService';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { formatDateTime } from '../../utils/helpers';

const ProfileScreen: React.FC = () => {
  const { navigate } = useNav();
  const { user, isAdmin, logout } = useAuth();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch {
            Alert.alert('Error', 'No se pudo cerrar la sesión');
          }
        },
      },
    ]);
  };

  const handleChangePassword = async () => {
    if (!newPassword) {
      Alert.alert('Error', 'Ingresa la nueva contraseña');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword(user!.email, currentPassword, newPassword);
      Alert.alert('Éxito', 'Contraseña cambiada correctamente');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'No se pudo cambiar la contraseña');
    } finally {
      setChangingPassword(false);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigate('Home')} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Avatar name={user.displayName} size={80} />
          <Text style={styles.userName}>{user.displayName}</Text>
          <Badge
            label={isAdmin ? 'Administrador' : 'Usuario'}
            variant={isAdmin ? 'primary' : 'info'}
            size="md"
          />
        </View>

        <Card style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Rol</Text>
            <Text style={styles.infoValue}>
              {isAdmin ? 'Administrador' : 'Usuario'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Miembro desde</Text>
            <Text style={styles.infoValue}>
              {formatDateTime(user.createdAt)}
            </Text>
          </View>
        </Card>

        <Card style={styles.passwordCard}>
          <View style={styles.passwordRow}>
            <View style={styles.passwordText}>
              <Text style={styles.passwordLabel}>Contraseña</Text>
              <Text style={styles.passwordDesc}>Cambia tu contraseña de acceso</Text>
            </View>
            <TouchableOpacity
              style={styles.passwordBtn}
              onPress={() => setShowPasswordModal(true)}
            >
              <Text style={styles.passwordBtnText}>Cambiar</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {isAdmin && (
          <Card style={styles.adminCard}>
            <Text style={styles.adminCardTitle}>Acceso de administrador</Text>
            <Text style={styles.adminCardDesc}>
              Tienes permisos para gestionar usuarios, avisos y actividades desde el panel de administración.
            </Text>
          </Card>
        )}

        <View style={styles.logoutSection}>
          <Button
            title="Cerrar sesión"
            onPress={handleLogout}
            variant="outline"
            size="lg"
          />
        </View>

        <Text style={styles.footer}>
          Desarrollado por JC =) · v1.0.0
        </Text>
      </ScrollView>

      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cambiar contraseña</Text>

            <Input
              label="Contraseña actual"
              placeholder="Ingresa tu contraseña actual"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
            />

            <Input
              label="Nueva contraseña"
              placeholder="Mínimo 6 caracteres"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
            />

            <Input
              label="Confirmar nueva contraseña"
              placeholder="Repite la nueva contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancelar"
                onPress={() => {
                  setShowPasswordModal(false);
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                variant="outline"
                style={styles.modalBtn}
              />
              <Button
                title="Guardar"
                onPress={handleChangePassword}
                loading={changingPassword}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  backBtn: {
    alignSelf: 'flex-start',
    padding: spacing.xs,
  },
  backArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 34,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingTop: spacing.lg,
  },
  userName: {
    ...typography.h2,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md - 4,
  },
  infoLabel: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.bodySmall,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  passwordCard: {
    marginBottom: spacing.lg,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordText: {
    flex: 1,
  },
  passwordLabel: {
    ...typography.body,
    fontWeight: '600',
  },
  passwordDesc: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  passwordBtn: {
    backgroundColor: colors.primary + '20',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  passwordBtnText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  adminCard: {
    marginBottom: spacing.lg,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  adminCardTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  adminCardDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  logoutSection: {
    paddingBottom: spacing.md,
  },
  footer: {
    ...typography.caption as any,
    color: colors.textMuted,
    textAlign: 'center',
    paddingBottom: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalBtn: {
    flex: 1,
  },
});

export default ProfileScreen;
