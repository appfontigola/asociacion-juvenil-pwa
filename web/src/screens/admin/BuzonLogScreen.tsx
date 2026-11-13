import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { getBuzonMessages, BuzonMessage } from '../../services/buzonService';
import Loading from '../../components/ui/Loading';

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
  fontWeight: 700,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
  fontFamily: 'inherit',
};

const titleStyle: React.CSSProperties = {
  ...typography.h2,
  margin: 0,
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const sectionTitleStyle: React.CSSProperties = {
  ...typography.h3,
  margin: `${spacing.md}px 0 ${spacing.sm}px`,
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const cardStyle: React.CSSProperties = {
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  border: `1px solid ${colors.border}`,
  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: spacing.md,
  marginBottom: spacing.sm,
};

const userNameStyle: React.CSSProperties = {
  ...typography.h3,
  margin: 0,
  color: colors.primary,
};

const dateStyle: React.CSSProperties = {
  ...typography.caption,
  margin: 0,
  color: colors.textSecondary,
};

const textStyle: React.CSSProperties = {
  ...typography.body,
  margin: `${spacing.sm}px 0 0`,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
};

const emptyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  color: colors.textSecondary,
  padding: spacing.xl,
};

const BuzonLogScreen: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<BuzonMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getBuzonMessages();
        setMessages(data);
      } catch {
        window.alert('Error al cargar los mensajes del buzón.');
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, []);

  if (loading) return <Loading fullScreen />;

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/admin')}>&lt;</button>
        <div>
          <h1 style={titleStyle}>Buzón de la asociación</h1>
        </div>
      </div>
      <div style={contentStyle}>
        <h3 style={sectionTitleStyle}>Mensajes recibidos</h3>
        {messages.length === 0 ? (
          <div style={emptyStyle}>
            <span style={{ fontSize: 32 }}>📭</span>
            <p style={{ margin: 0, fontSize: 16 }}>No hay mensajes en el buzón.</p>
          </div>
        ) : (
          <div style={listStyle}>
            {messages.map((msg) => (
              <div key={msg.id} style={cardStyle}>
                <div style={headerStyle}>
                  <span style={userNameStyle}>{msg.userName}</span>
                  <span style={dateStyle}>
                    {msg.createdAt.toLocaleDateString('es-ES')} {msg.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p style={textStyle}>{msg.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuzonLogScreen;
