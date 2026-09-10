import React, { useRef, useState, useEffect, useCallback } from 'react';
import { colors, borderRadius, spacing, typography } from '../constants/theme';

interface ImageCropModalProps {
  imageSrc: string;
  onCrop: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.85)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: spacing.lg,
};

const titleStyle: React.CSSProperties = {
  ...typography.h3,
  color: '#FEF5E6',
  marginBottom: spacing.md,
  textAlign: 'center',
};

const subtitleStyle: React.CSSProperties = {
  ...typography.bodySmall,
  color: 'rgba(254,245,230,0.7)',
  marginBottom: spacing.lg,
  textAlign: 'center',
};

const canvasContainerStyle: React.CSSProperties = {
  position: 'relative',
  borderRadius: borderRadius.lg,
  overflow: 'hidden',
  touchAction: 'none',
  cursor: 'grab',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: spacing.md,
  marginTop: spacing.lg,
};

const btnStyle: React.CSSProperties = {
  padding: '12px 28px',
  borderRadius: borderRadius.md,
  border: 'none',
  fontSize: 15,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const ImageCropModal: React.FC<ImageCropModalProps> = ({ imageSrc, onCrop, onCancel }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const cropRadius = 100;

  const draw = useCallback((cx: number, cy: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    ctx.drawImage(img, 0, 0, cw, ch);

    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, cropRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 0, 0, cw, ch);
    ctx.restore();

    ctx.strokeStyle = '#FEF5E6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, cropRadius, 0, Math.PI * 2);
    ctx.stroke();
  }, [cropRadius]);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      const container = containerRef.current;
      if (!container) return;

      const maxW = Math.min(320, window.innerWidth - 48);
      const maxH = window.innerHeight - 280;
      let w = img.naturalWidth;
      let h = img.naturalHeight;
      const scale = Math.min(maxW / w, maxH / h, 1);
      w = Math.round(w * scale);
      h = Math.round(h * scale);

      setImgSize({ w, h });

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = w;
        canvas.height = h;
      }

      const cx = w / 2;
      const cy = h / 2;
      setOffset({ x: cx, y: cy });
      img.onload = null;
      draw(cx, cy);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (imgSize.w > 0) {
      draw(offset.x, offset.y);
    }
  }, [offset, imgSize, draw]);

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const client = 'touches' in e ? e.touches[0] : e;
    return { x: client.clientX - rect.left, y: client.clientY - rect.top };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return;
    e.preventDefault();
    const pos = getPos(e);
    const cx = clamp(pos.x, cropRadius, imgSize.w - cropRadius);
    const cy = clamp(pos.y, cropRadius, imgSize.h - cropRadius);
    setOffset({ x: cx, y: cy });
  };

  const handleEnd = () => setDragging(false);

  const handleConfirm = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const out = document.createElement('canvas');
    out.width = cropRadius * 2;
    out.height = cropRadius * 2;
    const ctx = out.getContext('2d');
    if (!ctx) return;

    const sx = (offset.x - cropRadius) * (img.naturalWidth / imgSize.w);
    const sy = (offset.y - cropRadius) * (img.naturalHeight / imgSize.h);
    const sw = (cropRadius * 2) * (img.naturalWidth / imgSize.w);
    const sh = (cropRadius * 2) * (img.naturalHeight / imgSize.h);

    ctx.beginPath();
    ctx.arc(cropRadius, cropRadius, cropRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cropRadius * 2, cropRadius * 2);

    onCrop(out.toDataURL('image/jpeg', 0.85));
  };

  return (
    <div style={overlayStyle}>
      <p style={titleStyle}>Mueve para elegir la parte de la foto</p>
      <p style={subtitleStyle}>Arrastra el círculo sobre la zona que quieras usar</p>
      <div
        ref={containerRef}
        style={{ ...canvasContainerStyle, width: imgSize.w, height: imgSize.h }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>
      <div style={actionsStyle}>
        <button
          style={{ ...btnStyle, backgroundColor: 'rgba(254,245,230,0.15)', color: '#FEF5E6' }}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button
          style={{ ...btnStyle, backgroundColor: colors.primary, color: '#FEF5E6' }}
          onClick={handleConfirm}
        >
          Usar esta foto
        </button>
      </div>
    </div>
  );
};

export default ImageCropModal;
