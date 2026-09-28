import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToPush, isSubscribed } from '../../services/webPushService';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

const pageStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: colors.background,
  display: 'flex',
  flexDirection: 'column',
};

const logoSrc = import.meta.env.BASE_URL + 'logo.png';

const topBarStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  padding: `${spacing.sm}px ${spacing.lg}px`,
  borderBottom: `1px solid ${colors.border}`,
  position: 'sticky',
  top: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoImgStyle: React.CSSProperties = {
  height: 40,
  width: 'auto',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
};

const greetingStyle: React.CSSProperties = {
  ...typography.h2Gradient,
  marginBottom: spacing.lg,
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: spacing.md,
  marginBottom: spacing.lg,
};

const cardStyle: React.CSSProperties = {
  borderRadius: borderRadius.lg,
  padding: `${spacing.lg}px ${spacing.md}px`,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.sm,
  minHeight: 130,
  border: 'none',
  color: colors.text,
  fontFamily: 'inherit',
  fontSize: 16,
  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.35)',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const cardIconWrapStyle: React.CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.22)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 28,
  marginBottom: spacing.xs,
};

const cardLabelStyle: React.CSSProperties = {
  ...typography.body,
  fontWeight: 700,
  fontSize: 15,
};

const bottomStyle: React.CSSProperties = {
  ...typography.caption,
  textAlign: 'center',
  padding: spacing.md,
  marginTop: 'auto',
};

const cardThemes: { gradient: string; icon: string }[] = [
  { gradient: 'linear-gradient(135deg, #FEBE0F 0%, #FF7223 100%)', icon: '\uD83D\uDCE2' },
  { gradient: 'linear-gradient(135deg, #FFA4BF 0%, #FF7223 100%)', icon: '\uD83D\uDCC5' },
  { gradient: 'linear-gradient(135deg, #02AF77 0%, #4E8ABC 100%)', icon: '\uD83D\uDCCD' },
  { gradient: 'linear-gradient(135deg, #4E8ABC 0%, #0B151D 100%)', icon: '\uD83D\uDC64' },
  { gradient: 'linear-gradient(135deg, #FF7223 0%, #FEBE0F 100%)', icon: '\u2753' },
  { gradient: 'linear-gradient(135deg, #FF7223 0%, #FEBE0F 100%)', icon: '\uD83D\uDEE0\uFE0F' },
];

const normalCards = [
  { label: 'Avisos', route: '/notices' },
  { label: 'Calendario', route: '/calendar' },
  { label: 'Local', route: '/local' },
  { label: 'Perfil', route: '/profile' },
  { label: 'Ayuda', route: '/manual' },
];

const adminCard = { label: 'Panel Admin', route: '/admin' };

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [pushStatus, setPushStatus] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    const hasSW = 'serviceWorker' in navigator;
    const hasPush = 'PushManager' in window;
    const perm = 'Notification' in window ? Notification.permission : 'N/A';
    setPushStatus(`SW:${hasSW} Push:${hasPush} Perm:${perm}`);
    isSubscribed().then((s) => setSubscribed(s));
  }, [user?.id]);

  const handleSubscribe = async () => {
    if (!user?.id) return;
    setSubscribing(true);
    setPushStatus('Obteniendo SW...');
    try {
      const ok = await subscribeToPush(user.id);
      if (ok) {
        setSubscribed(true);
        setPushStatus('¡Suscrito!');
      } else {
        setPushStatus('No se pudo suscribir');
      }
    } catch (e: any) {
      setPushStatus('Error: ' + (e.message || String(e)));
    }
    setSubscribing(false);
  };

  const allCards = isAdmin ? [...normalCards, adminCard] : normalCards;

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <img src={logoSrc} alt="Asociación Juvenil" style={logoImgStyle} />
      </div>
      <div style={contentStyle}>
        <h2 style={greetingStyle}>
          ¡Bienvenido, {user?.displayName || 'Usuario'}!
        </h2>
        <div style={gridStyle}>
          {allCards.map((card, idx) => {
            const theme = cardThemes[idx % cardThemes.length];
            return (
              <button
                key={card.route}
                className="animate-pop"
                style={{
                  ...cardStyle,
                  background: theme.gradient,
                  animationDelay: `${idx * 80}ms`,
                }}
                onClick={() => navigate(card.route)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px) scale(1.02)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 28px rgba(255, 114, 35, 0.35)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0) scale(1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.35)';
                }}
              >
                <span style={cardIconWrapStyle}>{theme.icon}</span>
                <span style={cardLabelStyle}>{card.label}</span>
              </button>
            );
          })}
        </div>
        {!subscribed && (
          <>
            <button
              onClick={handleSubscribe}
              disabled={subscribing}
              style={{
                backgroundColor: '#FF7223',
                color: '#FEF5E6',
                border: 'none',
                borderRadius: borderRadius.md,
                padding: '14px 28px',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                marginBottom: spacing.sm,
                opacity: subscribing ? 0.5 : 1,
              }}
            >
              {subscribing ? '...' : '🔔 Activar notificaciones'}
            </button>
            {pushStatus && (
              <p style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', margin: 0, marginBottom: spacing.md }}>
                {pushStatus}
              </p>
            )}
          </>
        )}
        <div style={bottomStyle}>
          {user?.displayName} — v1.0.0
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
