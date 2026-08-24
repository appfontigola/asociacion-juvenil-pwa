export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'El email es requerido';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Email inválido';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'La contraseña es requerida';
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  if (!value.trim()) return `${fieldName} es requerido`;
  return null;
};

export const validateTitle = (title: string): string | null => {
  if (!title.trim()) return 'El título es requerido';
  if (title.length < 3) return 'El título debe tener al menos 3 caracteres';
  if (title.length > 100) return 'El título no puede exceder 100 caracteres';
  return null;
};

export const validateDescription = (description: string): string | null => {
  if (!description.trim()) return 'La descripción es requerida';
  if (description.length < 10) return 'La descripción debe tener al menos 10 caracteres';
  return null;
};
