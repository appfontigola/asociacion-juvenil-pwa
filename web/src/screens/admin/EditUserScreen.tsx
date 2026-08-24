import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as userService from '../../services/userService';
import { sendPasswordResetEmail } from '../../services/authService';
import { AppUser, UserRole } from '../../types';
import UserForm from '../../components/admin/UserForm';
import Loading from '../../components/ui/Loading';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.background,
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  padding: `${spacing.md}px ${spacing.lg}px`,
  borderBottom: `1px solid ${colors.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  position: 'sticky',
  top: 0,
  zIndex: 10,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 28,
  fontWeight: 700,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
  fontFamily: 'inherit',
};

const titleStyle: React.CSSProperties = {
  ...typography.h2,
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
};

const infoTextStyle: React.CSSProperties = {
  ...typography.caption,
  marginTop: spacing.sm,
  color: colors.textSecondary,
};

const EditUserScreen: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) return;
      try {
        const data = await userService.getUserById(userId);
        setUser(data);
      } catch {
        console.error('Error loading user');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [userId]);

  const handleSubmit = async (values: { email: string; password: string; displayName: string; role: UserRole }) => {
    if (!userId) return;
    setSubmitting(true);
    try {
      await userService.updateUser(userId, {
        displayName: values.displayName,
        role: values.role,
      });
      if (values.password) {
        await sendPasswordResetEmail(values.email);
      }
      navigate('/admin/users');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Error al actualizar usuario');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
          <h1 style={titleStyle}>Editar usuario</h1>
        </div>
        <div style={contentStyle}>
          <Loading />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
          <h1 style={titleStyle}>Editar usuario</h1>
        </div>
        <div style={contentStyle}>
          <p style={{ color: colors.error }}>Usuario no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
        <h1 style={titleStyle}>Editar usuario</h1>
      </div>
      <div style={contentStyle}>
        <UserForm
          initialValues={{
            email: user.email,
            password: '',
            displayName: user.displayName,
            role: user.role,
          }}
          onSubmit={handleSubmit}
          loading={submitting}
          isEditing
        />
        <p style={infoTextStyle}>
          Si escribes una nueva contraseña, se enviará un correo de restablecimiento al usuario.
        </p>
      </div>
    </div>
  );
};

export default EditUserScreen;
