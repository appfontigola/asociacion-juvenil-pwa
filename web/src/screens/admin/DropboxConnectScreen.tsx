import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Button from '../../components/ui/Button';
import Loading from '../../components/ui/Loading';
import { isDropboxConnected, startOAuthFlow } from '../../services/dropboxService';

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

const cardStyle: React.CSSProperties = {
  backgroundColor: colors.cardBackground,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
  alignItems: 'center',
  textAlign: 'center',
};

const statusRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
};

const statusDotStyle: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: '50%',
};

const statusTextStyle: React.CSSProperties = {
  ...typography.body,
  fontWeight: 600,
};

const infoStyle: React.CSSProperties = {
  ...typography.bodySmall,
  color: colors.textMuted,
  margin: 0,
};

const DropboxConnectScreen: React.FC = () => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    isDropboxConnected().then(setConnected);
  }, []);

  const handleConnect = async () => {
    await startOAuthFlow();
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 style={titleStyle}>Dropbox</h1>
      </div>

      {connected === null ? (
        <Loading />
      ) : (
        <div style={cardStyle}>
          <div style={statusRowStyle}>
            <span
              style={{
                ...statusDotStyle,
                backgroundColor: connected ? colors.success : colors.warning,
              }}
            />
            <span style={statusTextStyle}>
              {connected ? 'Conectado' : 'No conectado'}
            </span>
          </div>

          <p style={infoStyle}>
            {connected
              ? 'Los vídeos de la alarma se subirán automáticamente a tu Dropbox al guardarlos.'
              : 'Conecta tu Dropbox una sola vez para que los vídeos de la alarma se suban automáticamente.'}
          </p>

          {connected && (
            <Button
              title="Reconectar Dropbox"
              size="md"
              variant="secondary"
              onPress={handleConnect}
            />
          )}

          {!connected && (
            <Button
              title="Conectar Dropbox"
              size="md"
              onPress={handleConnect}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DropboxConnectScreen;