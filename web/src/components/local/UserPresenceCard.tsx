import React from 'react';
import { LocalPresence } from '../../types';
import { formatTimeAgo } from '../../utils/helpers';
import { colors, spacing, borderRadius, gradients } from '../../constants/theme';

interface UserPresenceCardProps {
  user: LocalPresence;
}

const cardStyle: React.CSSProperties = {
  background: gradients.cardTurquoise,
  borderRadius: borderRadius.md,
  padding: spacing.md,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  border: '1px solid rgba(2, 175, 119, 0.25)',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
};

const avatarStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: '50%',
  backgroundColor: colors.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  fontWeight: 700,
  color: '#FEF5E6',
  flexShrink: 0,
  userSelect: 'none',
};

const infoStyle: React.CSSProperties = {
  flex: 1,
};

const nameStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 600,
  color: colors.text,
  margin: 0,
};

const timeStyle: React.CSSProperties = {
  fontSize: 13,
  color: colors.textSecondary,
  margin: '2px 0 0',
};

const dotStyle: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: colors.success,
  flexShrink: 0,
};

const UserPresenceCard: React.FC<UserPresenceCardProps> = ({ user }) => {
  const initial = user.userName ? user.userName.trim().charAt(0).toUpperCase() : '?';

  return (
    <div style={cardStyle}>
      <div style={avatarStyle}>{initial}</div>
      <div style={infoStyle}>
        <p style={nameStyle}>{user.userName}</p>
        <p style={timeStyle}>Desde {formatTimeAgo(user.entryTime)}</p>
      </div>
      <div style={dotStyle} />
    </div>
  );
};

export default UserPresenceCard;
