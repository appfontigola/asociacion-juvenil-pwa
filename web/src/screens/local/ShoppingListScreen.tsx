import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAllUsers } from '../../services/userService';
import { AppUser } from '../../types';
import {
  subscribeToShoppingList,
  addShoppingItem,
  assignShoppingItem,
  unassignShoppingItem,
  togglePurchased,
  deleteShoppingItem,
  ShoppingItem,
} from '../../services/shoppingService';
import Avatar from '../../components/ui/Avatar';
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

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
};

const addRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.sm,
  marginBottom: spacing.md,
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 14px',
  backgroundColor: colors.inputBackground,
  border: `1.5px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  color: colors.text,
  fontSize: 15,
  outline: 'none',
  fontFamily: 'inherit',
};

const addBtnStyle: React.CSSProperties = {
  padding: '12px 18px',
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.md,
  fontWeight: 700,
  fontSize: 15,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

const itemCardStyle = (purchased: boolean): React.CSSProperties => ({
  background: purchased ? 'rgba(2, 175, 119, 0.08)' : gradients.card,
  borderRadius: borderRadius.sm,
  padding: `${spacing.sm}px ${spacing.md}px`,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  border: `1px solid ${purchased ? 'rgba(2, 175, 119, 0.3)' : 'rgba(255, 114, 35, 0.2)'}`,
  opacity: purchased ? 0.7 : 1,
});

const itemNameStyle = (purchased: boolean): React.CSSProperties => ({
  ...typography.bodySmall,
  color: '#FEF5E6',
  fontWeight: 600,
  textDecoration: purchased ? 'line-through' : 'none',
});

const itemRowStyle: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: spacing.sm,
  minWidth: 0,
};

const assignedStyle: React.CSSProperties = {
  ...typography.caption,
  color: colors.textSecondary,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  whiteSpace: 'nowrap',
  flexShrink: 0,
};

const checkBtnStyle = (purchased: boolean): React.CSSProperties => ({
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: `2px solid ${purchased ? colors.success : colors.border}`,
  backgroundColor: purchased ? colors.success : 'transparent',
  color: purchased ? '#FEF5E6' : colors.textMuted,
  fontSize: 14,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
});

const assignBtnStyle: React.CSSProperties = {
  padding: '2px 6px',
  borderRadius: borderRadius.sm,
  border: `1px solid ${colors.border}`,
  background: 'transparent',
  color: colors.textSecondary,
  fontSize: 10,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
};

const deleteBtnStyle: React.CSSProperties = {
  padding: '2px 4px',
  borderRadius: borderRadius.sm,
  border: 'none',
  background: 'transparent',
  color: colors.danger,
  fontSize: 14,
  cursor: 'pointer',
};

const dropdownStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: 100,
  left: spacing.lg,
  right: spacing.lg,
  backgroundColor: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  padding: spacing.sm,
  zIndex: 200,
  maxHeight: 250,
  overflow: 'auto',
  boxShadow: '0 8px 28px rgba(0, 0, 0, 0.5)',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  padding: '10px 12px',
  borderRadius: borderRadius.sm,
  border: 'none',
  background: 'transparent',
  color: colors.text,
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  fontFamily: 'inherit',
  fontSize: 14,
};

const emptyStyle: React.CSSProperties = {
  ...typography.bodySmall,
  color: colors.textMuted,
  textAlign: 'center',
  marginTop: spacing.xl,
  fontStyle: 'italic',
};

const ShoppingListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const [adding, setAdding] = useState(false);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [assigningTo, setAssigningTo] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToShoppingList((data) => {
      setItems(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => {});
  }, []);

  const handleAdd = async () => {
    if (!newItemName.trim()) return;
    setAdding(true);
    try {
      await addShoppingItem(newItemName.trim());
      setNewItemName('');
    } catch {
      window.alert('Error al añadir artículo');
    }
    setAdding(false);
  };

  const handleAssign = async (itemId: string, u: AppUser) => {
    try {
      await assignShoppingItem(itemId, u.id, u.displayName, u.photoURL || null);
      setAssigningTo(null);
    } catch {
      window.alert('Error al asignar');
    }
  };

  const handleUnassign = async (itemId: string) => {
    try {
      await unassignShoppingItem(itemId);
    } catch {}
  };

  const handleTogglePurchased = async (item: ShoppingItem) => {
    try {
      await togglePurchased(item.id, !item.purchased);
    } catch {}
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteShoppingItem(itemId);
    } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/local')}>‹</button>
        <h1 style={titleStyle}>Compras</h1>
      </div>
      <div style={contentStyle}>
        <div style={addRowStyle}>
          <input
            style={inputStyle}
            placeholder="Añadir artículo..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            style={{ ...addBtnStyle, opacity: adding ? 0.5 : 1 }}
            onClick={handleAdd}
            disabled={adding}
          >
            +
          </button>
        </div>

        {loading ? (
          <Loading />
        ) : items.length === 0 ? (
          <p style={emptyStyle}>No hay artículos en la lista</p>
        ) : (
          items.map((item) => (
            <div key={item.id} style={itemCardStyle(item.purchased)}>
              <button
                style={checkBtnStyle(item.purchased)}
                onClick={() => handleTogglePurchased(item)}
              >
                {item.purchased ? '✓' : ''}
              </button>
              <div style={itemRowStyle}>
                <div style={itemNameStyle(item.purchased)}>{item.name}</div>
                {item.assignedTo ? (
                  <span style={assignedStyle}>
                    <Avatar name={item.assignedToName || '?'} size={16} photoURL={item.assignedToPhoto || undefined} />
                    {item.assignedToName}
                    <button
                      style={{ ...assignBtnStyle, color: colors.danger, border: 'none', padding: '0 4px' }}
                      onClick={() => handleUnassign(item.id)}
                    >
                      ✕
                    </button>
                  </span>
                ) : (
                  <button
                    style={assignBtnStyle}
                    onClick={() => setAssigningTo(assigningTo === item.id ? null : item.id)}
                  >
                    + Asignar
                  </button>
                )}
              </div>
              <button style={deleteBtnStyle} onClick={() => handleDelete(item.id)}>
                🗑
              </button>
            </div>
          ))
        )}
      </div>

      {assigningTo && (
        <div style={dropdownStyle} onClick={() => setAssigningTo(null)}>
          <div style={{ ...dropdownItemStyle, color: colors.textMuted, fontWeight: 600, fontSize: 12 }}>
            Seleccionar usuario:
          </div>
          {users.filter((u) => u.active).map((u) => (
            <button
              key={u.id}
              style={dropdownItemStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleAssign(assigningTo, u);
              }}
            >
              <Avatar name={u.displayName} size={28} photoURL={u.photoURL} />
              {u.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingListScreen;
