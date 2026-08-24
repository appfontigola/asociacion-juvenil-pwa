import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotices } from '../../hooks/useNotices';
import Loading from '../../components/ui/Loading';
import Input from '../../components/ui/Input';
import { Notice } from '../../types';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.background,
  display: 'flex',
  flexDirection: 'column',
};

const topBarStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  padding: `${spacing.md}px ${spacing.lg}px`,
  borderBottom: `1px solid ${colors.border}`,
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  position: 'sticky',
  top: 0,
  zIndex: 10,
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
  ...typography.h3,
  flex: 1,
};

const formStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.lg,
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '14px 20px',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 'auto',
};

const EditNoticeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();
  const { getNotice, editNotice } = useNotices();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!noticeId) return;
    setLoading(true);
    getNotice(noticeId).then((data) => {
      if (data) {
        setTitle(data.title);
        setDescription(data.description);
      }
      setLoading(false);
    });
  }, [noticeId, getNotice]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeId || !title.trim() || !description.trim()) return;
    setSaving(true);
    try {
      await editNotice(noticeId, {
        title: title.trim(),
        description: description.trim(),
      });
      navigate(-1);
    } catch {
      window.alert('Error al guardar los cambios');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
          <span style={topBarTitleStyle}>Editar aviso</span>
        </div>
        <div style={{ ...formStyle, justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
        <span style={topBarTitleStyle}>Editar aviso</span>
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
          style={saveButtonStyle}
          disabled={saving || !title.trim() || !description.trim()}
          onMouseEnter={(e) => {
            if (!saving) { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.opacity = saving ? '0.5' : '1';
          }}
        >
          {saving ? '...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
};

export default EditNoticeScreen;
