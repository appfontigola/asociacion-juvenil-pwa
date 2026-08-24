import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const containerStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.background,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
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

const subtitleStyle: React.CSSProperties = {
  ...typography.bodySmall,
  marginBottom: spacing.md,
};

const cardWrapperStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  marginTop: spacing.lg,
};

const qrImageStyle: React.CSSProperties = {
  width: 300,
  height: 300,
  display: 'block',
};

const hintStyle: React.CSSProperties = {
  ...typography.caption,
  textAlign: 'center',
  marginTop: spacing.md,
};

const toggleStyle: React.CSSProperties = {
  display: 'flex',
  borderRadius: borderRadius.md,
  overflow: 'hidden',
  border: `1px solid ${colors.border}`,
  marginBottom: spacing.lg,
};

const toggleBtnStyle = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: '12px 0',
  border: 'none',
  cursor: 'pointer',
  fontSize: 15,
  fontWeight: active ? '600' as const : '400' as const,
  color: active ? '#FEF5E6' : colors.textMuted,
  backgroundColor: active ? colors.primary : 'transparent',
  transition: 'all 0.2s',
});

const PWA_URL = 'https://appfontigola.github.io/asociacion-juvenil-pwa/';

type Mode = 'entry' | 'exit';

const QRScreen: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('entry');
  const url = PWA_URL + (mode === 'entry' ? '?checkin' : '?checkout');

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(url)}`;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 style={titleStyle}>QR {mode === 'entry' ? 'entrada' : 'salida'}</h1>
      </div>

      <div style={toggleStyle}>
        <button style={toggleBtnStyle(mode === 'entry')} onClick={() => setMode('entry')}>
          Entrada
        </button>
        <button style={toggleBtnStyle(mode === 'exit')} onClick={() => setMode('exit')}>
          Salida
        </button>
      </div>

      <p style={subtitleStyle}>
        {mode === 'entry'
          ? 'Escanea para marcar entrada en el local'
          : 'Escanea para marcar salida del local'}
      </p>

      <div style={cardWrapperStyle}>
        <Card style={{ padding: spacing.md }}>
          <img
            src={qrSrc}
            alt={`QR de ${mode === 'entry' ? 'entrada' : 'salida'}`}
            style={qrImageStyle}
          />
        </Card>
      </div>

      {mode === 'entry' ? (
        <p style={hintStyle}>Imprime el QR y pégalo en la entrada del local</p>
      ) : (
        <p style={hintStyle}>Imprime el QR y pégalo en la salida del local</p>
      )}
    </div>
  );
};

export default QRScreen;
