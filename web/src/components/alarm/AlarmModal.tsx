import React, { useState, useRef, useEffect } from 'react';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import { AlarmAction } from '../../services/alarmService';

interface AlarmModalProps {
  open: boolean;
  action: AlarmAction;
  saving: boolean;
  onNo: () => void;
  onYes: (video: File | null) => void;
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

const questionStyle: React.CSSProperties = {
  ...typography.body,
  textAlign: 'center',
  margin: 0,
  color: colors.textSecondary,
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

const AlarmModal: React.FC<AlarmModalProps> = ({ open, action, saving, onNo, onYes }) => {
  const [step, setStep] = useState<'question' | 'video'>('question');
  const [video, setVideo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setStep('question');
      setVideo(null);
      setPreviewUrl(null);
    }
  }, [open]);

  if (!open) return null;

  const isActivate = action === 'activate';
  const questionText = isActivate
    ? '¿Has conectado la alarma?'
    : '¿Has desactivado la alarma?';

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
        {step === 'question' ? (
          <>
            <span style={titleStyle}>{questionText}</span>
            <p style={questionStyle}>
              {isActivate
                ? 'Confirma si has conectado la alarma al irte del local.'
                : 'Confirma si has desactivado la alarma al entrar en el local.'}
            </p>
            <div style={buttonRowStyle}>
              <button
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: colors.surfaceLight,
                  color: colors.text,
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                onClick={onNo}
              >
                No
              </button>
              <button
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: colors.primary,
                  color: '#FEF5E6',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.85'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                onClick={() => setStep('video')}
              >
                Sí
              </button>
            </div>
          </>
        ) : (
          <>
            <span style={titleStyle}>
              {isActivate ? 'Adjunta el vídeo de la alarma' : 'Adjunta el vídeo de la alarma'}
            </span>
            {previewUrl && (
              <video src={previewUrl} controls style={videoStyle} />
            )}
            {video && !previewUrl && <p style={fileNameStyle}>{video.name}</p>}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              style={{
                ...buttonBaseStyle,
                backgroundColor: colors.surfaceLight,
                color: colors.primary,
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {video ? 'Cambiar vídeo' : 'Adjuntar vídeo'}
            </button>
            <div style={buttonRowStyle}>
              <button
                style={{
                  ...buttonBaseStyle,
                  backgroundColor: colors.surfaceLight,
                  color: colors.text,
                }}
                onClick={onNo}
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
                onClick={() => onYes(video)}
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlarmModal;