import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../../services/userService';
import UserForm from '../../components/admin/UserForm';
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

const CreateUserScreen: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string; displayName: string; role: 'admin' | 'user' }) => {
    setLoading(true);
    try {
      await userService.createUser(values);
      navigate('/admin/users');
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
        <h1 style={titleStyle}>Crear usuario</h1>
      </div>
      <div style={contentStyle}>
        <UserForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
};

export default CreateUserScreen;
