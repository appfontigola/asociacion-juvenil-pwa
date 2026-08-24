import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { spacing } from '../../constants/theme';
import { validateTitle, validateDescription } from '../../utils/validators';

interface NoticeFormData {
  title: string;
  description: string;
}

interface NoticeFormProps {
  initialValues?: NoticeFormData;
  onSubmit: (data: NoticeFormData) => Promise<void>;
  loading?: boolean;
}

const NoticeForm: React.FC<NoticeFormProps> = ({ initialValues, onSubmit, loading }) => {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    const titleError = validateTitle(title);
    const descError = validateDescription(description);
    if (titleError) newErrors.title = titleError;
    if (descError) newErrors.description = descError;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit({ title, description });
  };

  return (
    <View style={styles.container}>
      <Input
        label="Título"
        placeholder="Título del aviso"
        value={title}
        onChangeText={setTitle}
        error={errors.title}
      />
      <Input
        label="Descripción"
        placeholder="Describe el aviso..."
        value={description}
        onChangeText={setDescription}
        error={errors.description}
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />
      <Button
        title={initialValues ? 'Guardar cambios' : 'Publicar aviso'}
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
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default NoticeForm;
