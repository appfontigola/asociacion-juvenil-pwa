import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../ui/Card';
import Avatar from '../ui/Avatar';
import { LocalPresence } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';
import { formatTimeAgo } from '../../utils/helpers';

interface UserPresenceCardProps {
  user: LocalPresence;
}

const UserPresenceCard: React.FC<UserPresenceCardProps> = ({ user }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <Avatar name={user.userName} size={44} />
        <View style={styles.info}>
          <Text style={styles.name}>{user.userName}</Text>
          <Text style={styles.time}>
            Desde {formatTimeAgo(user.entryTime)}
          </Text>
        </View>
        <View style={styles.statusDot} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    ...typography.body,
    fontWeight: '600',
  },
  time: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success,
  },
});

export default UserPresenceCard;
