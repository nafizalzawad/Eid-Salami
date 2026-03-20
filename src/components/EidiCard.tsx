import { useRef, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Download, Share2, Smartphone } from 'lucide-react';
import { getThemeById } from '@/lib/cardThemes';

const drawPattern = (ctx: CanvasRenderingContext2D, w: number, h: number, patternType: string, accentColor: string) => {
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = accentColor;

  if (patternType === 'stars') {
    for (let i = 0; i < 60; i++) {
      const sx = Math.random() * w;
      const sy = Math.random() * h;
      const sr = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (patternType === 'lanterns') {
    ctx.font = '30px serif';
    for (let i = 0; i < 12; i++) {
      ctx.fillText('🏮', Math.random() * w, Math.random() * h);
    }
  } else if (patternType === 'alpona') {
    ctx.lineWidth = 2;
    ctx.strokeStyle = accentColor;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 50 * (i + 1), 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (patternType === 'geometric') {
    for (let i = 0; i < 20; i++) {
      ctx.strokeRect(Math.random() * w, Math.random() * h, 40, 40);
    }
  } else if (patternType === 'confetti') {
    const colors = ['#FFD700', '#FF4081', '#00E676', '#2979FF'];
    for (let i = 0; i < 80; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(Math.random() * w, Math.random() * h, 6, 6);
    }
  }
  ctx.restore();
};

interface EidiCardProps {
  amount: string;
  message: string;
  senderName: string;
  eidMessage?: string;
  themeId?: string;
  isClaimMode?: boolean;
  onShareComplete?: () => void;
}

export interface EidiCardHandle {
  share: () => Promise<void>;
}

const EidiCard = forwardRef<EidiCardHandle, EidiCardProps>(({ amount, message, senderName, eidMessage, themeId, isClaimMode, onShareComplete }, ref) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const theme = useMemo(() => getThemeById(themeId || 'islamic-emerald'), [themeId]);

  // Helper for drawing rounded rectangles with fallback for older browsers
  const drawRoundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }
  };
  const generateCardBlob = useCallback(async (): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const w = 600;
    const h = 800;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, theme.bgGradient[0]);
    bgGrad.addColorStop(0.5, theme.bgGradient[1]);
    bgGrad.addColorStop(1, theme.bgGradient[2]);
    ctx.fillStyle = bgGrad;
    drawRoundRect(ctx, 0, 0, w, h, 32);
    ctx.fill();

    // Draw pattern
    drawPattern(ctx, w, h, theme.patternType, theme.secondaryColor);

    // Emoji/Icon
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText(theme.emoji, w / 2, 130);
    
    // Message wrapping utility
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), x, y);
      return y;
    };

    // "Eid Mubarak" title
    ctx.fillStyle = theme.accentColor;
    ctx.font = `bold 52px ${theme.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.fillText('Eid Mubarak!', w / 2, 210);

    // Decorative line
    ctx.strokeStyle = theme.accentColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 140, 235);
    ctx.lineTo(w / 2 + 140, 235);
    ctx.stroke();

    // From sender
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = theme.textColor;
    ctx.font = `26px ${theme.fontFamily}`;
    ctx.fillText(`From ${senderName} 💚`, w / 2, 285);

    // Eid message with wrapping
    let nextY = 325;
    if (eidMessage) {
      ctx.globalAlpha = 0.6;
      ctx.font = `italic 20px ${theme.fontFamily}`;
      nextY = wrapText(`"${eidMessage}"`, w / 2, 325, w - 120, 26) + 40;
    } else {
      nextY = 325;
    }

    // Amount card
    const cardY = nextY;
    const cardH = 180;
    ctx.globalAlpha = 1;
    ctx.fillStyle = theme.cardBg;
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    ctx.beginPath();
    drawRoundRect(ctx, 60, cardY, w - 120, cardH, 32);
    ctx.fill();
    ctx.shadowColor = 'transparent';

    // Amount text
    if (amount !== '0') {
      ctx.fillStyle = '#111111';
      ctx.font = `bold 50px ${theme.fontFamily}`;
      ctx.fillText(`You got ${amount} ৳!`, w / 2, cardY + 75);
    }

    // Segment Message with wrapping
    ctx.fillStyle = '#555555';
    ctx.font = `22px ${theme.fontFamily}`;
    wrapText(message, w / 2, cardY + (amount !== '0' ? 125 : 95), w - 200, 30);

    // Branding
    ctx.fillStyle = theme.textColor;
    ctx.globalAlpha = 0.4;
    ctx.font = '16px system-ui';
    ctx.fillText('Made with Eidi Wheel — by Nafiz Al Zawad 🌙', w / 2, h - 40);

    // Border
    ctx.strokeStyle = theme.accentColor;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 10;
    ctx.beginPath();
    drawRoundRect(ctx, 10, 10, w - 20, h - 20, 25);
    ctx.stroke();

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob!), 'image/png');
    });
  }, [amount, message, senderName, eidMessage, theme, drawPattern]);

  const downloadCard = useCallback(async () => {
    try {
      const blob = await generateCardBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `eidi-card-${senderName}.png`;
      
      // Better mobile compatibility: append to body before click
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Delay revocation for mobile browsers to process the download
      setTimeout(() => URL.revokeObjectURL(url), 500);
    } catch (err) {
      console.error('Download failed:', err);
      // Fallback: If blob download fails, try data URL as it's sometimes more reliable on mobile
      try {
        const canvas = document.createElement('canvas');
        // Redraw manually or from blob if possible, but keep it simple
        alert('Could not start automatic download. Please use the Share button or take a screenshot! 💚');
      } catch (e) {}
    }
  }, [senderName, generateCardBlob]);

  const shareCard = useCallback(async () => {
    const text = `Eid Mubarak! 🎉\n${senderName} sent me ${amount !== '0' ? amount + ' ৳' : 'a special message'} as Eidi!\n${message}`;
    
    try {
      if (navigator.share) {
        const blob = await generateCardBlob();
        const file = new File([blob], `eidi-card-${senderName}.png`, { type: 'image/png' });
        
        // Check if file sharing is supported
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'My Eidi Card 🎁',
            text: text,
          });
        } else {
          // Fallback to text share
          await navigator.share({ title: 'My Eidi Card 🎁', text });
        }
        onShareComplete?.();
      } else {
        await navigator.clipboard.writeText(text);
        onShareComplete?.();
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Final fallback to clipboard
      await navigator.clipboard.writeText(text);
    }
  }, [amount, message, senderName, generateCardBlob]);

  useImperativeHandle(ref, () => ({
    share: shareCard
  }));

  return (
    <div className="w-full max-w-sm group">
      <div
        ref={cardRef}
        className="rounded-3xl p-6 border-4 relative overflow-hidden transition-all duration-500 shadow-2xl group-hover:scale-[1.02]"
        style={{
          background: `linear-gradient(to bottom, ${theme.bgGradient[0]}, ${theme.bgGradient[1]}, ${theme.bgGradient[2]})`,
          borderColor: `${theme.accentColor}44`,
          fontFamily: theme.fontFamily,
          color: theme.textColor
        }}
      >
        {/* Dynamic Pattern Overlays */}
        <div className="absolute inset-0 opacity-10 pointer-events-none select-none overflow-hidden">
          {theme.patternType === 'stars' && Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="star absolute" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} />
          ))}
          {theme.patternType === 'alpona' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-8 rounded-full border-current opacity-20" />
              <div className="w-48 h-48 border-4 rounded-full border-current absolute opacity-10" />
            </div>
          )}
        </div>

        {/* Emoji Icon */}
        <div className="flex justify-center mb-4 transform group-hover:scale-110 transition-transform duration-500">
          <span className="text-6xl filter drop-shadow-lg">{theme.emoji}</span>
        </div>

        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: theme.accentColor }}>
          Eid Mubarak!
        </h2>

        <p className="text-center opacity-80 text-lg font-medium mb-1">
          From {senderName} 💚
        </p>

        {eidMessage && (
          <p className="text-center opacity-60 text-sm italic mb-4 px-4 line-clamp-2">
            "{eidMessage}"
          </p>
        )}

        {/* Inner Card */}
        <div 
          className="bg-white rounded-2xl p-6 mx-2 text-center shadow-xl transform transition-transform duration-500"
          style={{ backgroundColor: theme.cardBg, color: '#111' }}
        >
          {amount !== '0' && (
            <p className="text-3xl font-bold mb-2">
              You got {amount} ৳!
            </p>
          )}
          <p className="text-gray-600 text-base leading-relaxed">{message}</p>
        </div>

        {/* Footer info */}
        <div className="mt-8 flex justify-center opacity-40 text-xs text-center border-t pt-4" style={{ borderColor: `${theme.accentColor}22` }}>
          <span>© Nafiz Al Zawad — Eidi Wheel 🌙</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-6">
        {/* In claim mode, we prioritize the Download button for FB sharing */}
        <div className="flex gap-3">
          <button
            onClick={downloadCard}
            className="btn-gold flex-1 flex items-center justify-center gap-3 text-lg py-4 shadow-lg hover:shadow-xl transition-all active:scale-95 animate-bounce-in"
            style={{ backgroundColor: theme.accentColor, color: theme.bgGradient[0].length > 7 ? '#fff' : theme.bgGradient[2] }}
          >
            <Download size={24} /> Download Eidi Card 🎁
          </button>
          <button
            onClick={shareCard}
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 font-semibold rounded-2xl px-5 py-4 transition-all hover:bg-white/20 active:scale-95 shadow-lg"
          >
            <Share2 size={24} />
          </button>
        </div>
      </div>
    </div>
  );
});


export default EidiCard;
