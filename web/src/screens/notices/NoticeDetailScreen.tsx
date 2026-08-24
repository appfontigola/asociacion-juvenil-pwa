import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotices } from '../../hooks/useNotices';
import Loading from '../../components/ui/Loading';
import Avatar from '../../components/ui/Avatar';
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

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
};

const titleStyle: React.CSSProperties = {
  ...typography.h1,
  marginBottom: spacing.sm,
};

const metaStyle: React.CSSProperties = {
  ...typography.caption,
  marginBottom: spacing.lg,
};

const bodyStyle: React.CSSProperties = {
  ...typography.body,
  lineHeight: 1.7,
  whiteSpace: 'pre-wrap',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.md,
  marginTop: 'auto',
  paddingTop: spacing.xl,
};

const editButtonStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '14px 20px',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
};

const deleteButtonStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.error,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '14px 20px',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  textAlign: 'center',
};

const NoticeDetailScreen: React.FC = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams<{ noticeId: string }>();
  const { isAdmin } = useAuth();
  const { getNotice, removeNotice } = useNotices();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!noticeId) return;
    setLoading(true);
    getNotice(noticeId).then((data) => {
      setNotice(data);
      setLoading(false);
    });
  }, [noticeId, getNotice]);

  const handleDelete = async () => {
    if (!noticeId) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar este aviso?')) return;
    setDeleting(true);
    try {
      await removeNotice(noticeId);
      navigate('/notices');
    } catch {
      window.alert('Error al eliminar el aviso');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
          <span style={topBarTitleStyle}>Aviso</span>
        </div>
        <div style={{ ...contentStyle, justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
          <span style={topBarTitleStyle}>Aviso</span>
        </div>
        <div style={{ ...contentStyle, justifyContent: 'center', alignItems: 'center' }}>
          <p style={{ color: colors.textMuted }}>Aviso no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>‹</button>
        <span style={topBarTitleStyle}>Aviso</span>
      </div>
      <div style={contentStyle}>
        <h1 style={titleStyle}>{notice.title}</h1>
        <div style={metaStyle}>
          <Avatar name={notice.authorName} size={22} photoURL={notice.authorPhotoURL} />
          <span>Por {notice.authorName} — {new Date(notice.createdAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}</span>
        </div>
        <div style={bodyStyle}>{notice.description}</div>
        {isAdmin && (
          <div style={actionsStyle}>
            <button
              style={editButtonStyle}
              onClick={() => navigate(`/notices/edit/${noticeId}`)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              Editar
            </button>
            <button
              style={deleteButtonStyle}
              onClick={handleDelete}
              disabled={deleting}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              {deleting ? '...' : 'Eliminar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeDetailScreen;
