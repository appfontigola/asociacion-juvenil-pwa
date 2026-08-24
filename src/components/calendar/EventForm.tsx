import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { spacing } from '../../constants/theme';
import { validateTitle, validateDescription, validateRequired } from '../../utils/validators';
import { formatDate } from '../../utils/helpers';

interface EventFormData {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
}

interface EventFormProps {
  initialValues?: EventFormData;
  onSubmit: (data: EventFormData) => Promise<void>;
  loading?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({ initialValues, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [date, setDate] = useState(initialValues?.date || new Date());
  const [time, setTime] = useState(initialValues?.time || '');
  const [location, setLocation] = useState(initialValues?.location || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    const titleError = validateTitle(title);
    const descError = validateDescription(description);
    const timeError = validateRequired(time, 'La hora');
    if (titleError) newErrors.title = titleError;
    if (descError) newErrors.description = descError;
    if (timeError) newErrors.time = timeError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({ title, description, date, time, location });
  };

  return (
    <View style={styles.container}>
      <Input
        label="Título"
        placeholder="Título de la actividad"
        value={title}
        onChangeText={setTitle}
        error={errors.title}
      />
      <Input
        label="Descripción"
        placeholder="Describe la actividad..."
        value={description}
        onChangeText={setDescription}
        error={errors.description}
        multiline
        numberOfLines={3}
        style={styles.textArea}
      />
      <Input
        label="Fecha"
        placeholder="Seleccionar fecha"
        value={formatDate(date)}
        onFocus={() => setShowDatePicker(true)}
        editable={false}
      />
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
      <Input
        label="Hora"
        placeholder="Ej: 18:00"
        value={time}
        onChangeText={setTime}
        error={errors.time}
      />
      <Input
        label="Ubicación (opcional)"
        placeholder="Dirección o lugar"
        value={location}
        onChangeText={setLocation}
      />
      <Button
        title={initialValues ? 'Guardar cambios' : 'Crear actividad'}
        onPress={handleSubmit}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default EventForm;
