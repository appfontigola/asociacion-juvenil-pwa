import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';

interface UploadVideoModalProps {
  open: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: (video: File) => void;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: spacing.lg,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: colors.surface,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
  maxWidth: 420,
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.lg,
};

const titleStyle: React.CSSProperties = {
  ...typography.h3,
  margin: 0,
  textAlign: 'center',
};

const subtitleStyle: React.CSSProperties = {
  ...typography.body,
  textAlign: 'center',
  margin: 0,
  color: colors.textSecondary,
};

const videoStyle: React.CSSProperties = {
  width: '100%',
  maxHeight: 320,
  borderRadius: borderRadius.md,
  backgroundColor: '#0B151D',
};

const fileNameStyle: React.CSSProperties = {
  ...typography.caption,
  textAlign: 'center',
  margin: 0,
  wordBreak: 'break-all',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.md,
  justifyContent: 'center',
};

const buttonBaseStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px 20px',
  borderRadius: borderRadius.md,
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  border: 'none',
  fontFamily: 'inherit',
  transition: 'opacity 0.2s ease',
};

const UploadVideoModal: React.FC<UploadVideoModalProps> = ({
  open,
  saving,
  onCancel,
  onSave,
}) => {
  const [video, setVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setVideo(null);
      setPreviewUrl(null);
    }
  }, [open]);

  if (!open) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideo(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <span style={titleStyle}>🎃 Subir vídeo</span>
        <p style={subtitleStyle}>Selecciona o graba un vídeo del pasaje</p>
        {previewUrl && <video src={previewUrl} controls style={videoStyle} />}
        {video && !previewUrl && <p style={fileNameStyle}>{video.name}</p>}
        <input
          ref={galleryInputRef}
          type="file"
          accept="video/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <div style={buttonRowStyle}>
          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: colors.surfaceLight,
              color: colors.primary,
            }}
            onClick={() => galleryInputRef.current?.click()}
          >
            📁 Elegir de galería
          </button>
          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: colors.surfaceLight,
              color: colors.primary,
            }}
            onClick={() => cameraInputRef.current?.click()}
          >
            📷 Grabar vídeo
          </button>
        </div>
        {video && (
          <p style={fileNameStyle}>Seleccionado: {video.name}</p>
        )}
        <div style={buttonRowStyle}>
          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: colors.surfaceLight,
              color: colors.text,
            }}
            onClick={onCancel}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            style={{
              ...buttonBaseStyle,
              backgroundColor: colors.primary,
              color: '#FEF5E6',
              opacity: saving ? 0.5 : 1,
            }}
            onClick={() => video && onSave(video)}
            disabled={!video || saving}
          >
            {saving ? 'Subiendo...' : 'Subir'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadVideoModal;
