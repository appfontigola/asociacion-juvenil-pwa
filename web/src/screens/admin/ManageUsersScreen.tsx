import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as userService from '../../services/userService';
import { AppUser } from '../../types';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import Loading from '../../components/ui/Loading';
import { colors, spacing, borderRadius, typography, gradients } from '../../constants/theme';

const pageStyle: React.CSSProperties = {
  flex: 1,
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
  flex: 1,
};

const addButtonStyle: React.CSSProperties = {
  padding: `${spacing.sm}px ${spacing.md}px`,
  borderRadius: borderRadius.sm,
  border: 'none',
  background: gradients.cardOrange,
  color: colors.text,
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.2s ease',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
};

const userCardStyle: React.CSSProperties = {
  background: gradients.card,
  borderRadius: borderRadius.md,
  padding: spacing.md,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  border: '1px solid rgba(255, 114, 35, 0.2)',
};

const userInfoStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
};

const userNameStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: colors.text,
  margin: 0,
};

const badgesStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.xs,
  flexWrap: 'wrap',
};

const userActionsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
};

const actionButtonStyle: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: borderRadius.sm,
  border: 'none',
  fontWeight: 600,
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  transition: 'opacity 0.2s ease',
};

const ManageUsersScreen: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch {
      console.error('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleActive = async (u: AppUser) => {
    try {
      await userService.toggleUserActive(u.id, !u.active);
      setUsers((prev) =>
        prev.map((x) => (x.id === u.id ? { ...x, active: !x.active } : x))
      );
    } catch {
      console.error('Error toggling user active status');
    }
  };

  const handleDelete = async (u: AppUser) => {
    if (!confirm(`¿Eliminar a ${u.displayName}? Esta acción no se puede deshacer.`)) return;
    try {
      await userService.deleteUser(u.id);
      setUsers((prev) => prev.filter((x) => x.id !== u.id));
    } catch (e: any) {
      alert('Error: ' + (e.message || String(e)));
    }
  };

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/admin')}>‹</button>
        <h1 style={titleStyle}>Gestionar usuarios</h1>
        <button
          style={addButtonStyle}
          onClick={() => navigate('/admin/create-user')}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
        >
          + Añadir
        </button>
      </div>
      <div style={contentStyle}>
        {loading ? (
          <Loading />
        ) : (
          users.map((u) => (
            <div key={u.id} style={userCardStyle}>
              <Avatar name={u.displayName} size={44} photoURL={u.photoURL} />
              <div style={userInfoStyle}>
                <p style={userNameStyle}>{u.displayName}</p>
                <div style={badgesStyle}>
                  <Badge
                    label={u.role === 'admin' ? 'Administrador' : 'Usuario'}
                    variant={u.role === 'admin' ? 'primary' : 'info'}
                  />
                  <Badge
                    label={u.active ? 'Activo' : 'Inactivo'}
                    variant={u.active ? 'success' : 'danger'}
                  />
                </div>
              </div>
              <div style={userActionsStyle}>
                <button
                  style={{ ...actionButtonStyle, backgroundColor: colors.primary, color: '#FEF5E6' }}
                  onClick={() => navigate(`/admin/edit-user/${u.id}`)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                >
                  Editar
                </button>
                <button
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: u.active ? colors.warning : colors.success,
                    color: '#0B151D',
                  }}
                  onClick={() => handleToggleActive(u)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                >
                  {u.active ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  style={{
                    ...actionButtonStyle,
                    backgroundColor: colors.danger,
                    color: '#FEF5E6',
                  }}
                  onClick={() => handleDelete(u)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageUsersScreen;
