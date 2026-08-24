import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotices } from '../../hooks/useNotices';
import Input from '../../components/ui/Input';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.background,
  padding: spacing.md,
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  marginBottom: spacing.lg,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 28,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
};

const topBarTitleStyle: React.CSSProperties = {
  ...typography.h2,
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const submitButtonStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '14px 28px',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  width: '100%',
  opacity: 1,
};

const CreateNoticeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createNotice } = useNotices();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !user) return;
    setSaving(true);
    try {
      await createNotice({
        title: title.trim(),
        description: description.trim(),
        authorId: user.id,
        authorName: user.displayName,
        authorPhotoURL: user.photoURL,
      });
      navigate('/notices');
    } catch {
      window.alert('Error al crear el aviso');
      setSaving(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
        <span style={topBarTitleStyle}>Nuevo aviso</span>
      </div>
      <form onSubmit={handleSubmit} style={formStyle}>
        <Input
          label="Título"
          placeholder="Título del aviso"
          value={title}
          onChangeText={setTitle}
        />
        <Input
          label="Descripción"
          placeholder="Escribe el contenido del aviso..."
          value={description}
          onChangeText={setDescription}
          multiline
          rows={5}
        />
        <button
          type="submit"
          style={submitButtonStyle}
          disabled={saving || !title.trim() || !description.trim()}
          onMouseEnter={(e) => {
            if (!saving) { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = saving ? '0.5' : '1';
          }}
        >
          {saving ? '...' : 'Crear aviso'}
        </button>
      </form>
    </div>
  );
};

export default CreateNoticeScreen;
