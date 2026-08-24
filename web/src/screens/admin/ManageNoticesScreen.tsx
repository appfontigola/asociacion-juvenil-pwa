import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotices } from '../../hooks/useNotices';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.background,
  padding: spacing.lg,
};

const headerStyle: React.CSSProperties = {
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

const titleStyle: React.CSSProperties = {
  ...typography.h2,
  flex: 1,
};

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: spacing.md,
};

const noticeItemStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: spacing.md,
};

const noticeInfoStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const noticeTitleStyle: React.CSSProperties = {
  ...typography.body,
  margin: 0,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const noticeDateStyle: React.CSSProperties = {
  ...typography.caption,
  margin: '4px 0 0',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
};

const ManageNoticesScreen: React.FC = () => {
  const navigate = useNavigate();
  const { notices, loading } = useNotices();

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/admin')}>
          ‹
        </button>
        <h1 style={titleStyle}>Gestionar avisos</h1>
      </div>

      <div style={topBarStyle}>
        <Button
          title="Crear aviso"
          onPress={() => navigate('/admin/create-notice')}
          size="sm"
        />
      </div>

      {loading ? (
        <Loading message="Cargando avisos..." />
      ) : notices.length === 0 ? (
        <p style={{ ...typography.bodySmall, textAlign: 'center', marginTop: spacing.xl }}>
          No hay avisos disponibles
        </p>
      ) : (
        <div style={listStyle}>
          {notices.map((notice) => (
            <Card key={notice.id}>
              <div style={noticeItemStyle}>
                <div style={noticeInfoStyle}>
                  <p style={noticeTitleStyle}>{notice.title}</p>
                  <p style={noticeDateStyle}>{formatDate(notice.createdAt)}</p>
                </div>
                <Button
                  title="Editar"
                  variant="outline"
                  size="sm"
                  onPress={() => navigate(`/admin/edit-notice/${notice.id}`)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageNoticesScreen;
