import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { colors, gradients, spacing, borderRadius, typography } from '../../constants/theme';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: gradients.backgroundTop,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.lg,
};

const formStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const logoSrc = import.meta.env.BASE_URL + 'logo.png';

const logoStyle: React.CSSProperties = {
  width: 140,
  height: 'auto',
  display: 'block',
  margin: '0 auto',
  marginBottom: spacing.lg,
};

const subtitleStyle: React.CSSProperties = {
  ...typography.bodySmall,
  textAlign: 'center',
  marginBottom: spacing.xl,
  color: colors.textSecondary,
};

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      const param = searchParams.has('checkin') ? 'checkin' : searchParams.has('checkout') ? 'checkout' : '';
      navigate(param ? `/?${param}` : '/');
    } catch (err: any) {
      window.alert(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <img src={logoSrc} alt="Asociación Juvenil" style={logoStyle} />
        <p style={subtitleStyle}>Inicia sesión para continuar</p>
        <Input
          label="Correo electrónico"
          type="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title="Iniciar sesión"
          type="submit"
          size="lg"
          loading={loading}
          disabled={loading}
          style={{ marginTop: spacing.sm }}
        />
      </form>
    </div>
  );
};

export default LoginScreen;
