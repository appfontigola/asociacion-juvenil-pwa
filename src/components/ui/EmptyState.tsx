import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon }) => {
  return (
    <View style={styles.container}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    ...typography.h3,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    ...typography.bodySmall,
    textAlign: 'center',
    color: colors.textMuted,
  },
});

export default EmptyState;
