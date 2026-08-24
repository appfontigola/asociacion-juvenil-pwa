import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { changePassword } from '../../services/authService';
import { updateUser } from '../../services/userService';
import { formatDateTime } from '../../utils/helpers';
import { colors, spacing, borderRadius, typography, gradients } from '../../constants/theme';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const pageStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.background,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  padding: `${spacing.md}px ${spacing.lg}px`,
  borderBottom: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 28,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
  fontFamily: 'inherit',
};

const headerTitleStyle: React.CSSProperties = {
  ...typography.h3,
  marginLeft: spacing.md,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.lg,
  maxWidth: 500,
  width: '100%',
  alignSelf: 'center',
};

const profileHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
};

const nameRoleStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
};

const displayNameStyle: React.CSSProperties = {
  ...typography.h2,
};

const cardStyle: React.CSSProperties = {
  background: gradients.card,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
  border: '1px solid rgba(255, 114, 35, 0.22)',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
};

const cardTitleStyle: React.CSSProperties = {
  ...typography.h3,
  marginBottom: spacing.xs,
};

const infoRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const infoLabelStyle: React.CSSProperties = {
  ...typography.bodySmall,
};

const infoValueStyle: React.CSSProperties = {
  ...typography.body,
  textAlign: 'right',
  maxWidth: '60%',
  wordBreak: 'break-word',
};

const passwordFormStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
  marginTop: spacing.sm,
};

const logoutSectionStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: spacing.md,
  marginBottom: spacing.xl,
};

const changePhotoStyle: React.CSSProperties = {
  cursor: 'pointer',
  borderRadius: '50%',
  position: 'relative',
  display: 'inline-flex',
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  backgroundColor: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#FEF5E6',
  fontSize: 11,
  fontWeight: 600,
};

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout, updateUserInContext } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoURL, setPhotoURL] = useState<string | undefined>(user?.photoURL);
  const [hoverPhoto, setHoverPhoto] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result as string;
        setPhotoURL(dataUrl);
        await updateUser(user.id, { photoURL: dataUrl });
        updateUserInContext({ photoURL: dataUrl });
      };
      reader.readAsDataURL(file);
    } catch {
      window.alert('Error al cargar la imagen');
    }
  };

  const handleChangePassword = async () => {
    if (!user) return;
    if (newPassword !== confirmPassword) {
      window.alert('Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 6) {
      window.alert('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }
    setSavingPassword(true);
    try {
      await changePassword(user.email, currentPassword, newPassword);
      window.alert('Contraseña cambiada exitosamente');
      setShowPasswordForm(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      window.alert(err.message || 'Error al cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      window.alert('Error al cerrar sesión');
    }
  };

  if (!user) return null;

  const roleBadgeVariant = isAdmin ? 'primary' : 'info';
  const roleLabel = isAdmin ? 'Administrador' : 'Miembro';

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/')}>
          &lsaquo;
        </button>
        <span style={headerTitleStyle}>Perfil</span>
      </div>
      <div style={contentStyle}>
        <div style={profileHeaderStyle}>
          <div
            style={changePhotoStyle}
            onClick={() => fileInputRef.current?.click()}
            onMouseEnter={() => setHoverPhoto(true)}
            onMouseLeave={() => setHoverPhoto(false)}
          >
            <Avatar name={user.displayName} size={56} photoURL={photoURL} />
            {hoverPhoto && <div style={overlayStyle}>Cambiar</div>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <div style={nameRoleStyle}>
            <span style={displayNameStyle}>{user.displayName}</span>
            <Badge label={roleLabel} variant={roleBadgeVariant} size="md" />
          </div>
        </div>

        <div style={cardStyle}>
          <span style={cardTitleStyle}>Información</span>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Email</span>
            <span style={infoValueStyle}>{user.email}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Rol</span>
            <span style={infoValueStyle}>{roleLabel}</span>
          </div>
          <div style={infoRowStyle}>
            <span style={infoLabelStyle}>Miembro desde</span>
            <span style={infoValueStyle}>{formatDateTime(user.createdAt)}</span>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={infoRowStyle}>
            <span style={cardTitleStyle}>Contraseña</span>
            <Button
              title={showPasswordForm ? 'Cancelar' : 'Cambiar'}
              variant="outline"
              size="sm"
              onPress={() => setShowPasswordForm(!showPasswordForm)}
            />
          </div>
          {showPasswordForm && (
            <div style={passwordFormStyle}>
              <Input
                label="Contraseña actual"
                type="password"
                placeholder="••••••••"
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <Input
                label="Nueva contraseña"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Input
                label="Confirmar nueva contraseña"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <Button
                title="Guardar"
                size="md"
                loading={savingPassword}
                disabled={savingPassword}
                onPress={handleChangePassword}
                style={{ marginTop: spacing.xs }}
              />
            </div>
          )}
        </div>

        {isAdmin && (
          <div style={cardStyle}>
            <span style={cardTitleStyle}>Administrador</span>
            <span style={infoLabelStyle}>
              Tienes acceso completo al panel de administración.
            </span>
          </div>
        )}

        <div style={logoutSectionStyle}>
          <Button
            title="Cerrar sesión"
            variant="outline"
            size="md"
            onPress={handleLogout}
          />
        </div>

        <p style={{ ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xl }}>
          Desarrollado por JC =) · v1.0.0
        </p>
      </div>
    </div>
  );
};

export default ProfileScreen;
