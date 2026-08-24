import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNav } from '../../navigation/NavContext';
import UserForm from '../../components/admin/UserForm';
import { createUser } from '../../services/userService';
import { CreateUserData } from '../../types';
import { colors } from '../../constants/theme';

const CreateUserScreen: React.FC = () => {
  const { goBack } = useNav();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateUserData) => {
    setLoading(true);
    try {
      await createUser(data);
      Alert.alert('Éxito', 'Usuario creado correctamente');
      goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      if (message.includes('email-already-in-use')) {
        Alert.alert('Error', 'Este email ya está registrado');
      } else {
        Alert.alert('Error', 'No se pudo crear el usuario');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Text style={styles.backArrow}>‹</Text>
      </TouchableOpacity>
      <UserForm onSubmit={handleSubmit} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
  },
  backBtn: {
    marginBottom: 8,
    alignSelf: 'flex-start',
    padding: 4,
  },
  backArrow: {
    fontSize: 32,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: 34,
  },
});

export default CreateUserScreen;
