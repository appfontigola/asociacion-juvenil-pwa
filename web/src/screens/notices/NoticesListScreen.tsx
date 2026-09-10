import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotices } from '../../hooks/useNotices';
import { useBadgesContext } from '../../contexts/BadgesContext';
import Loading from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import { colors, spacing, borderRadius, typography, gradients } from '../../constants/theme';

const pageStyle: React.CSSProperties = {
  flex: 1,
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

const createButtonStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const noticeCardStyle: React.CSSProperties = {
  background: gradients.cardOrange,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  cursor: 'pointer',
  border: '1px solid rgba(255, 114, 35, 0.28)',
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
  transition: 'opacity 0.2s ease',
};

const noticeTitleStyle: React.CSSProperties = {
  ...typography.h3,
  marginBottom: spacing.xs,
};

const noticeDateStyle: React.CSSProperties = {
  ...typography.caption,
};

const NoticesListScreen: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { notices, loading, fetchNotices } = useNotices();
  const { markNoticesSeen } = useBadgesContext();

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  useEffect(() => {
    markNoticesSeen();
  }, [markNoticesSeen]);

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate('/')}>‹</button>
          <span style={topBarTitleStyle}>Avisos</span>
        </div>
        <div style={{ ...contentStyle, justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/')}>‹</button>
        <span style={topBarTitleStyle}>Avisos</span>
        {isAdmin && (
          <button style={createButtonStyle} onClick={() => navigate('/notices/create')}>
            + Nuevo
          </button>
        )}
      </div>
      <div style={contentStyle}>
        {notices.length === 0 ? (
          <EmptyState title="No hay avisos" message="Todavía no se han publicado avisos." />
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              style={noticeCardStyle}
              onClick={() => navigate(`/notices/detail/${notice.id}`)}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.9'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
            >
              <div style={noticeTitleStyle}>{notice.title}</div>
              <div style={noticeDateStyle}>
                {new Date(notice.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NoticesListScreen;
