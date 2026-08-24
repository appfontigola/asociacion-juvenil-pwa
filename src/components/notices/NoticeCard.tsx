import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Notice } from '../../types';
import { colors, spacing, typography } from '../../constants/theme';
import { formatTimeAgo } from '../../utils/helpers';

interface NoticeCardProps {
  notice: Notice;
  onPress: () => void;
  isAdmin?: boolean;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, onPress, isAdmin }) => {
  return (
    <Card onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {notice.title}
        </Text>
        {isAdmin && (
          <Badge label="Admin" variant="primary" size="sm" />
        )}
      </View>
      <Text style={styles.description} numberOfLines={3}>
        {notice.description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.author}>{notice.authorName}</Text>
        <Text style={styles.date}>{formatTimeAgo(notice.createdAt)}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h3,
    flex: 1,
    marginRight: spacing.sm,
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  author: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  date: {
    ...typography.caption,
  },
});

export default NoticeCard;
