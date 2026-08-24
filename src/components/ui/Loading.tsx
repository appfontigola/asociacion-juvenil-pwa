import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: 'small' | 'large';
}

const Loading: React.FC<LoadingProps> = ({
  message = 'Cargando...',
  fullScreen = false,
  size = 'large',
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  text: {
    ...typography.bodySmall,
    marginTop: 12,
    color: colors.textSecondary,
  },
});

export default Loading;
