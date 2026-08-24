import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { colors, spacing, typography } from '../../constants/theme';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';
import { UserRole } from '../../types';
import { Text, TouchableOpacity } from 'react-native';

interface UserFormData {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

interface UserFormProps {
  initialValues?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  loading?: boolean;
  isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ initialValues, onSubmit, loading, isEditing }) => {
  const [email, setEmail] = useState(initialValues?.email || '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(initialValues?.displayName || '');
  const [role, setRole] = useState<UserRole>(initialValues?.role || 'user');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const emailError = validateEmail(email);
    const nameError = validateRequired(displayName, 'El nombre');
    if (emailError) newErrors.email = emailError;
    if (nameError) newErrors.displayName = nameError;
    if (!isEditing || password) {
      const passError = validatePassword(password);
      if (passError) newErrors.password = passError;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({ email, password, displayName, role });
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        placeholder="correo@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!isEditing}
      />
      <Input
        label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
        placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Mínimo 6 caracteres'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        error={errors.password}
      />
      <Input
        label="Nombre completo"
        placeholder="Nombre del usuario"
        value={displayName}
        onChangeText={setDisplayName}
        error={errors.displayName}
      />
      <Text style={styles.roleLabel}>Rol</Text>
      <View style={styles.roleSelector}>
        <TouchableOpacity
          style={[styles.roleOption, role === 'user' && styles.roleSelected]}
          onPress={() => setRole('user')}
        >
          <Text style={[styles.roleText, role === 'user' && styles.roleTextSelected]}>
            Usuario
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleOption, role === 'admin' && styles.roleSelected]}
          onPress={() => setRole('admin')}
        >
          <Text style={[styles.roleText, role === 'admin' && styles.roleTextSelected]}>
            Administrador
          </Text>
        </TouchableOpacity>
      </View>
      <Button
        title={isEditing ? 'Guardar cambios' : 'Crear usuario'}
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roleLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  roleOption: {
    flex: 1,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  roleSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '20',
  },
  roleText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  roleTextSelected: {
    color: colors.primary,
  },
});

export default UserForm;
