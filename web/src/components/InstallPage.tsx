import React from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { colors, spacing, borderRadius } from '../constants/theme';

const logoSrc = import.meta.env.BASE_URL + 'logo.png';

const pageStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#0B151D',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.xl,
  textAlign: 'center',
};

const iconStyle: React.CSSProperties = {
  width: 120,
  height: 'auto',
  marginBottom: spacing.lg,
};

const subtitleStyle: React.CSSProperties = {
  color: 'rgba(254, 245, 230, 0.55)',
  fontSize: 16,
  margin: 0,
  marginBottom: spacing.xl,
  lineHeight: '22px',
};

const installBtnStyle: React.CSSProperties = {
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.lg,
  padding: '16px 40px',
  fontSize: 18,
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
  maxWidth: 300,
};

const hintStyle: React.CSSProperties = {
  color: 'rgba(254, 245, 230, 0.55)',
  fontSize: 13,
  marginTop: spacing.lg,
  lineHeight: '22px',
  whiteSpace: 'pre-line',
};

const stepStyle: React.CSSProperties = {
  color: 'rgba(254, 245, 230, 0.55)',
  fontSize: 14,
  marginTop: spacing.md,
  lineHeight: '24px',
  whiteSpace: 'pre-line',
  textAlign: 'left',
  maxWidth: 300,
};

function isiOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

const InstallPage: React.FC = () => {
  const { canInstall, install } = useInstallPrompt();
  const ios = isiOS();

  return (
    <div style={pageStyle}>
      <img src={logoSrc} alt="Asociación Juvenil" style={iconStyle} />
      <p style={subtitleStyle}>
        Instala la app para gestionar avisos, eventos, local y más
      </p>

      {canInstall ? (
        <button style={installBtnStyle} onClick={install}>
          Instalar app
        </button>
      ) : ios ? (
        <>
          <div style={stepStyle}>
            1. Toca Compartir <span style={{fontSize:20}}>⎙</span>{'\n'}
            2. Desplázate y toca "Añadir a pantalla de inicio"{'\n'}
            3. Toca "Añadir"
          </div>
          <p style={hintStyle}>
            Después, abre la app desde el icono en tu pantalla de inicio
          </p>
        </>
      ) : (
        <>
          <div style={stepStyle}>
            1. Toca el menú ⋮ (arriba a la derecha){'\n'}
            2. Toca "Instalar app"{'\n'}
            3. Confirma la instalación
          </div>
          <p style={hintStyle}>
            Si no aparece "Instalar app", busca "Añadir a pantalla de inicio"
          </p>
        </>
      )}
    </div>
  );
};

export default InstallPage;
