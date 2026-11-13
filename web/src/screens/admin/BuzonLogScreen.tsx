import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { getBuzonMessages, deleteBuzonMessage, BuzonMessage } from '../../services/buzonService';
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
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',
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

const asuntoStyle: React.CSSProperties = {
  ...typography.body,
  margin: `${spacing.sm}px 0 0`,
  lineHeight: 1.5,
  fontWeight: 600,
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

const detailOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
};

const detailCardStyle: React.CSSProperties = {
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.xl,
  border: `1px solid ${colors.border}`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  maxWidth: 500,
  width: '90%',
  maxHeight: '90vh',
  overflowY: 'auto',
};

const detailHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: spacing.md,
  marginBottom: spacing.md,
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.textSecondary,
  fontSize: 24,
  cursor: 'pointer',
  lineHeight: 1,
  padding: 0,
};

const detailTitleStyle: React.CSSProperties = {
  ...typography.h2,
  margin: 0,
};

const detailMetaStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
  marginBottom: spacing.lg,
};

const detailMetaRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  color: colors.textSecondary,
};

const detailLabelStyle: React.CSSProperties = {
  color: colors.primary,
  fontWeight: 600,
};

const detailTextStyle: React.CSSProperties = {
  ...typography.body,
  margin: 0,
  lineHeight: 1.6,
  whiteSpace: 'pre-wrap',
};

const deleteButtonStyle: React.CSSProperties = {
  background: '#E53935',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  marginTop: spacing.md,
};

const confirmOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 200,
};

const confirmCardStyle: React.CSSProperties = {
  background: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.xl,
  border: `1px solid ${colors.border}`,
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
  maxWidth: 400,
  width: '85%',
};

const confirmTitleStyle: React.CSSProperties = {
  ...typography.h3,
  margin: 0,
  color: colors.primary,
};

const confirmTextStyle: React.CSSProperties = {
  ...typography.body,
  margin: `${spacing.md}px 0 0`,
  lineHeight: 1.5,
  color: colors.text,
};

const confirmButtonGroupStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: spacing.md,
  marginTop: spacing.lg,
};

const cancelButtonStyle: React.CSSProperties = {
  background: 'transparent',
  color: colors.textSecondary,
  border: `1px solid ${colors.border}`,
  borderRadius: borderRadius.md,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const confirmDeleteButtonStyle: React.CSSProperties = {
  background: '#E53935',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '10px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const BuzonLogScreen: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<BuzonMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<BuzonMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<BuzonMessage | null>(null);

  const handleDelete = async () => {
    if (!messageToDelete) return;
    try {
      await deleteBuzonMessage(messageToDelete.id);
      setMessages((prev) => prev.filter((m) => m.id !== messageToDelete.id));
      setSelectedMessage(null);
      setMessageToDelete(null);
    } catch {
      window.alert('Error al eliminar el mensaje.');
    }
  };

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

  const renderContent = () => (
    <>
      {selectedMessage && (
        <div style={detailOverlayStyle}>
          <div style={detailCardStyle}>
            <div style={detailHeaderStyle}>
              <div>
                <h1 style={detailTitleStyle}>Buzón</h1>
              </div>
              <button
                style={closeButtonStyle}
                onClick={() => setSelectedMessage(null)}
              >
                ✕
              </button>
            </div>
            <div style={detailMetaStyle}>
              <div style={detailMetaRowStyle}>
                <span style={detailLabelStyle}>Usuario:</span>
                <span>{selectedMessage.userName}</span>
              </div>
              <div style={detailMetaRowStyle}>
                <span style={detailLabelStyle}>Asunto:</span>
                <span>{selectedMessage.asunto}</span>
              </div>
              <div style={detailMetaRowStyle}>
                <span style={detailLabelStyle}>Fecha:</span>
                <span>
                  {selectedMessage.createdAt.toLocaleDateString('es-ES')} {selectedMessage.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            <div style={{ marginTop: spacing.md }}>
              <h3 style={sectionTitleStyle}>Mensaje</h3>
              <p style={detailTextStyle}>{selectedMessage.text}</p>
              <button
                style={deleteButtonStyle}
                onClick={() => setMessageToDelete(selectedMessage)}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {!selectedMessage && (
        <div style={pageStyle}>
          <div style={topBarStyle}>
            <button style={backButtonStyle} onClick={() => navigate('/admin')}>{ '<' }</button>
            <div>
              <h1 style={titleStyle}>Buzón</h1>
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
                  <div
                    key={msg.id}
                    style={cardStyle}
                    onClick={() => setSelectedMessage(msg)}
                  >
                    <div style={headerStyle}>
                      <span style={userNameStyle}>{msg.userName}</span>
                      <span style={dateStyle}>
                        {msg.createdAt.toLocaleDateString('es-ES')} {msg.createdAt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p style={asuntoStyle}>{msg.asunto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {messageToDelete && (
        <div style={confirmOverlayStyle}>
          <div style={confirmCardStyle}>
            <h2 style={confirmTitleStyle}>¿Eliminar mensaje?</h2>
            <p style={confirmTextStyle}>
              ¿Estás seguro de que quieres eliminar este mensaje del buzón?
            </p>
            <div style={confirmButtonGroupStyle}>
              <button
                style={cancelButtonStyle}
                onClick={() => setMessageToDelete(null)}
              >
                Cancelar
              </button>
              <button
                style={confirmDeleteButtonStyle}
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return renderContent();
};

export default BuzonLogScreen;
