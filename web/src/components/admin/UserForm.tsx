import React, { useState } from 'react';
import { UserRole } from '../../types';
import { validateEmail, validateRequired, validatePassword } from '../../utils/validators';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface UserFormValues {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

interface UserFormProps {
  initialValues?: UserFormValues;
  onSubmit: (values: UserFormValues) => Promise<void>;
  loading?: boolean;
  isEditing?: boolean;
}

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const roleSelectorStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.sm,
};

const roleButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px 16px',
  borderRadius: borderRadius.md,
  border: '1.5px solid',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  textAlign: 'center',
  transition: 'opacity 0.2s ease',
};

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmit,
  loading = false,
  isEditing = false,
}) => {
  const [email, setEmail] = useState(initialValues?.email || '');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState(initialValues?.displayName || '');
  const [role, setRole] = useState<UserRole>(initialValues?.role || 'user');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const emailError = validateEmail(email);
    if (emailError) newErrors.email = emailError;

    if (!isEditing || password) {
      const passwordError = validatePassword(password);
      if (passwordError) newErrors.password = passwordError;
    }

    const nameError = validateRequired(displayName, 'El nombre');
    if (nameError) newErrors.displayName = nameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({ email, password, displayName, role });
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <Input
        label="Email"
        type="email"
        placeholder="usuario@ejemplo.com"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        disabled={isEditing}
      />
      <Input
        label={isEditing ? 'Nueva contraseña (opcional)' : 'Contraseña'}
        type="password"
        placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Contraseña'}
        value={password}
        onChangeText={setPassword}
        error={errors.password}
      />
      <Input
        label="Nombre completo"
        placeholder="Nombre del usuario"
        value={displayName}
        onChangeText={setDisplayName}
        error={errors.displayName}
      />
      <div>
        <label style={{ color: colors.textSecondary, fontSize: 13, fontWeight: 500, marginBottom: spacing.xs, display: 'block' }}>
          Rol
        </label>
        <div style={roleSelectorStyle}>
          <button
            type="button"
            style={{
              ...roleButtonStyle,
              borderColor: role === 'user' ? colors.primary : colors.border,
              backgroundColor: role === 'user' ? colors.primary : 'transparent',
              color: role === 'user' ? '#FEF5E6' : colors.text,
            }}
            onClick={() => setRole('user')}
          >
            Usuario
          </button>
          <button
            type="button"
            style={{
              ...roleButtonStyle,
              borderColor: role === 'admin' ? colors.primary : colors.border,
              backgroundColor: role === 'admin' ? colors.primary : 'transparent',
              color: role === 'admin' ? '#FEF5E6' : colors.text,
            }}
            onClick={() => setRole('admin')}
          >
            Administrador
          </button>
        </div>
      </div>
      <Button
        type="submit"
        title={isEditing ? 'Guardar cambios' : 'Crear usuario'}
        loading={loading}
        disabled={loading}
        size="lg"
        style={{ marginTop: spacing.sm }}
      />
    </form>
  );
};

export default UserForm;
