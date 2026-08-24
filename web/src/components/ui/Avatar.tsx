import React from 'react';
import { colors } from '../../constants/theme';

interface AvatarProps {
  name: string;
  size?: number;
  photoURL?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, size = 44, photoURL }) => {
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: colors.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        fontWeight: 700,
        color: '#FEF5E6',
        flexShrink: 0,
        userSelect: 'none',
      }}
    >
      {initial}
    </div>
  );
};

export default Avatar;
