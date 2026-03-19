import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EidBackground from '@/components/EidBackground';
import SpinningWheel from '@/components/SpinningWheel';
import { getWheel, getShareUrl, getShareText, WheelData } from '@/lib/wheelStore';
import { Copy, Check, MessageCircle, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SharePage() {
  const { wheelId } = useParams<{ wheelId: string }>();
  const navigate = useNavigate();
  const [wheel, setWheel] = useState<WheelData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!wheelId) return;
    const w = getWheel(wheelId);
    if (!w) {
      navigate('/');
      return;
    }
    setWheel(w);
  }, [wheelId, navigate]);

  if (!wheel) return null;

  const shareUrl = getShareUrl(wheel.id);
  const shareText = getShareText(wheel.senderName, shareUrl);

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied! 🎉');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'Eidi Wheel 🎁', text: shareText, url: shareUrl });
    } else {
      copyLink();
    }
  };

  return (
    <EidBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="animate-bounce-in">
          <h1 className="font-display text-3xl font-bold text-center mb-2">
            Your Eidi Wheel is Ready! 🎁
          </h1>
          <p className="text-center text-primary-foreground/70 mb-6">
            Share it with friends and family
          </p>
        </div>

        <div className="mb-6 opacity-90 pointer-events-none animate-slide-up">
          <SpinningWheel segments={wheel.segments} size={200} />
        </div>

        <div className="w-full max-w-sm space-y-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Link copy */}
          <div className="card-festive flex items-center gap-2">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-foreground text-sm truncate focus:outline-none font-body"
            />
            <button onClick={copyLink} className="shrink-0 text-primary hover:text-primary/80 transition-colors">
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>

          {/* Share buttons */}
          <button onClick={shareWhatsApp} className="btn-festive w-full flex items-center justify-center gap-2">
            <MessageCircle size={20} /> Share on WhatsApp
          </button>

          <button onClick={shareNative} className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold rounded-2xl px-8 py-3 text-base transition-all hover:bg-primary-foreground/20 w-full flex items-center justify-center gap-2">
            <Share2 size={18} /> More Sharing Options
          </button>

          <button
            onClick={() => navigate(`/verify/${wheel.id}`)}
            className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold rounded-2xl px-8 py-3 text-base transition-all hover:bg-primary-foreground/20 w-full flex items-center justify-center gap-2"
          >
            📋 View Claims & Verify
          </button>

          <button
            onClick={() => navigate('/create')}
            className="text-center w-full text-sm text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors mt-4"
          >
            Create Another Wheel ✨
          </button>
        </div>
      </div>
    </EidBackground>
  );
}
