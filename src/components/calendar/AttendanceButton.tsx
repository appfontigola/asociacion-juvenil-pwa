import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button, { ButtonProps } from '../ui/Button';
import { AttendanceStatus } from '../../types';
import { spacing } from '../../constants/theme';

interface AttendanceButtonProps {
  currentStatus: AttendanceStatus | null;
  onSelectStatus: (status: AttendanceStatus) => void;
  loading?: boolean;
}

const AttendanceButton: React.FC<AttendanceButtonProps> = ({
  currentStatus,
  onSelectStatus,
  loading,
}) => {
  const options: { status: AttendanceStatus; label: string; icon: string; variant: ButtonProps['variant'] }[] = [
    { status: 'going', label: 'Voy a asistir', icon: '✅', variant: 'primary' },
    { status: 'not_going', label: 'No puedo asistir', icon: '❌', variant: 'danger' },
    { status: 'undecided', label: 'Aún no lo sé', icon: '❓', variant: 'outline' },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = currentStatus === option.status;
        const buttonVariant = isSelected ? option.variant : 'outline';
        return (
          <Button
            key={option.status}
            title={option.label}
            onPress={() => onSelectStatus(option.status)}
            variant={buttonVariant}
            size="sm"
            loading={loading}
            style={styles.button}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    minWidth: 100,
  },
});

export default AttendanceButton;
