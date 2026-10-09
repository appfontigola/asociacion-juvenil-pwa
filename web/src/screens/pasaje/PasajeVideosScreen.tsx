import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import EmptyState from '../../components/ui/EmptyState';
import Loading from '../../components/ui/Loading';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import {
  subscribeToPasajeVideos,
  PasajeVideoEntry,
} from '../../services/pasajeVideoService';
import { downloadDropboxFile } from '../../services/dropboxService';

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

const topBarTitleStyle: React.CSSProperties = {
  ...typography.h3,
  color: colors.primary,
  margin: 0,
};

const subtitleStyle: React.CSSProperties = {
  ...typography.caption,
  margin: '2px 0 0',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: spacing.lg,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const dayHeaderStyle: React.CSSProperties = {
  ...typography.h3,
  margin: `${spacing.md}px 0 ${spacing.sm}px`,
  color: colors.primary,
  fontSize: 18,
};

const videoCardStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.md,
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
  border: `1px solid ${colors.border}`,
};

const videoMetaStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
};

const avatarStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: '50%',
  objectFit: 'cover',
  border: `2px solid ${colors.primary}`,
  flexShrink: 0,
};

const avatarFallbackStyle: React.CSSProperties = {
  ...avatarStyle,
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
  fontSize: 14,
};

const videoInfoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
};

const userNameStyle: React.CSSProperties = {
  ...typography.body,
  fontWeight: 600,
  margin: 0,
};

const timeStyle: React.CSSProperties = {
  ...typography.caption,
  margin: 0,
};

const videoPlayerStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: 400,
  borderRadius: borderRadius.md,
  backgroundColor: '#0B151D',
};

const toDirectUrl = (url: string): string => {
  if (url.includes('dl.dropboxusercontent.com')) return url;
  return url
    .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
    .replace('dropbox.com', 'dl.dropboxusercontent.com')
    .replace(/[?&]dl=0/, '?dl=1')
    .replace(/\?dl=1&/, '?')
    .replace(/&dl=1/, '');
};

const playButtonStyle: React.CSSProperties = {
  ...typography.body,
  backgroundColor: colors.primary,
  color: '#FEF5E6',
  border: 'none',
  borderRadius: borderRadius.md,
  padding: '8px 16px',
  cursor: 'pointer',
  fontFamily: 'inherit',
  fontWeight: 600,
  alignSelf: 'flex-start',
};

const WEEKDAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const MONTHS = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

const formatDateLabel = (dateStr: string): string => {
  const parts = dateStr.split('-');
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
};

const formatTime = (d: Date): string =>
  `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

const PasajeVideosScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [videos, setVideos] = useState<PasajeVideoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const [loadingVideo, setLoadingVideo] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToPasajeVideos((entries) => {
      setVideos(entries);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handlePlay = async (v: PasajeVideoEntry) => {
    if (playingId === v.id) {
      setPlayingId(null);
      setPlayingUrl(null);
      return;
    }
    setLoadingVideo(v.id);
    try {
      let url: string;
      if (v.dropboxPath) {
        url = await downloadDropboxFile(v.dropboxPath);
      } else {
        url = toDirectUrl(v.videoUrl);
      }
      if (playingUrl) URL.revokeObjectURL(playingUrl);
      setPlayingUrl(url);
      setPlayingId(v.id);
    } catch {
      window.alert('No se pudo cargar el vídeo.');
    } finally {
      setLoadingVideo(null);
    }
  };

  const grouped: { date: string; items: PasajeVideoEntry[] }[] = [];
  for (const v of videos) {
    const last = grouped[grouped.length - 1];
    if (last && last.date === v.date) {
      last.items.push(v);
    } else {
      grouped.push({ date: v.date, items: [v] });
    }
  }

  return (
    <div style={pageStyle}>
      <div style={topBarStyle}>
        <button style={backButtonStyle} onClick={() => navigate('/pasaje')}>‹</button>
        <div>
          <h1 style={topBarTitleStyle}>🎬 Vídeos del pasaje</h1>
          <p style={subtitleStyle}>{videos.length} vídeos subidos</p>
        </div>
      </div>
      <div style={contentStyle}>
        {loading ? (
          <Loading />
        ) : videos.length === 0 ? (
          <EmptyState
            title="No hay vídeos todavía"
            message="Los vídeos que subas aparecerán aquí ordenados por día."
          />
        ) : (
          grouped.map((group) => (
            <div key={group.date}>
              <h3 style={dayHeaderStyle}>📅 {formatDateLabel(group.date)}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                {group.items.map((v) => (
                  <div key={v.id} style={videoCardStyle}>
                    <div style={videoMetaStyle}>
                      {v.userPhotoURL ? (
                        <img src={v.userPhotoURL} alt={v.userName} style={avatarStyle} />
                      ) : (
                        <div style={avatarFallbackStyle}>
                          {v.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div style={videoInfoStyle}>
                        <p style={userNameStyle}>{v.userName}</p>
                        <p style={timeStyle}>
                          {formatDateLabel(v.date)} · {formatTime(v.timestamp)}
                        </p>
                      </div>
                    </div>
                    {playingId === v.id && playingUrl ? (
                      <video src={playingUrl} controls autoPlay style={videoPlayerStyle} />
                    ) : (
                      <button
                        style={{ ...playButtonStyle, opacity: loadingVideo === v.id ? 0.5 : 1 }}
                        onClick={() => handlePlay(v)}
                        disabled={loadingVideo === v.id}
                      >
                        {loadingVideo === v.id ? '⏳ Cargando...' : '▶ Ver vídeo'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PasajeVideosScreen;
