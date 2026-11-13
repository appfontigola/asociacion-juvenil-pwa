import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { sendBuzonMessage } from '../../services/buzonService';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

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

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 200,
  padding: spacing.md,
  borderRadius: borderRadius.md,
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.surface,
  color: colors.text,
  fontFamily: 'inherit',
  fontSize: 16,
  resize: 'vertical',
};

const buttonStyle: React.CSSProperties = {
  background: colors.primary,
  color: '#FFFFFF',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '14px 28px',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  alignSelf: 'flex-start',
};

const buttonDisabledStyle: React.CSSProperties = {
  ...buttonStyle,
  opacity: 0.6,
  cursor: 'not-allowed',
};

const successStyle: React.CSSProperties = {
  background: 'rgba(2, 175, 119, 0.15)',
  border: `1px solid rgba(2, 175, 119, 0.4)`,
  borderRadius: borderRadius.md,
  padding: spacing.md,
  color: colors.text,
  fontSize: 15,
  textAlign: 'center',
};

const emptyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  color: colors.textSecondary,
};

const BuzonScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const userId = user?.id || '';
  const userName = user?.displayName || 'Usuario';

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendBuzonMessage(userId, userName, text.trim());
      setSent(true);
      setText('');
    } catch {
      window.alert('Error al enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={pageStyle}>
        <div style={topBarStyle}>
          <button style={backButtonStyle} onClick={() => navigate('/')}>&lt;</button>
          <div>
            <h1 style={titleStyle}>Buzón de la asociación</h1>
          </div>
        </div>
        <div style={contentStyle}>
          <div style={successStyle}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
              ¡Mensaje enviado!
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 14 }}>
              Gracias por tu mensaje. Lo hemos recibido correctamente.
            </p>
          </div>
          <button style={buttonStyle} onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/')}>&lt;</button>
        <div>
          <h1 style={titleStyle}>Buzón de la asociación</h1>
        </div>
      </div>
      <div style={contentStyle}>
        <h3 style={sectionTitleStyle}>Envíanos un mensaje</h3>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: 0 }}>
          Escribe tu consulta, sugerencia o incidencia. Te responderemos lo antes posible.
        </p>
        <form onSubmit={handleSend} style={formStyle}>
          <textarea
            style={textareaStyle}
            placeholder="Escribe aquí tu mensaje..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
          />
          <button
            style={sending ? buttonDisabledStyle : buttonStyle}
            disabled={sending || !text.trim()}
            type="submit"
          >
            {sending ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuzonScreen;
