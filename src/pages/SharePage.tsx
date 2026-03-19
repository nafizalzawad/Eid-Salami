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
        <div className="animate-bounce-in text-center">
          <h1 className="font-display text-4xl font-bold mb-2">
            Nafiz's Eidi Wheel 🎁
          </h1>
          <p className="text-primary-foreground/70 mb-6 text-lg">
            Share this link with friends to send Eidi!
          </p>
        </div>

        <div className="mb-6 opacity-90 pointer-events-none animate-slide-up">
          <SpinningWheel segments={wheel.segments} size={220} />
        </div>

        <div className="w-full max-w-sm space-y-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          {/* Link copy */}
          <div className="card-festive flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md">
            <input
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent text-foreground text-base truncate focus:outline-none font-bold"
            />
            <button onClick={copyLink} className="shrink-0 text-primary hover:text-primary/80 transition-colors">
              {copied ? <Check size={24} /> : <Copy size={24} />}
            </button>
          </div>

          {/* Share buttons */}
          <button onClick={shareWhatsApp} className="btn-festive w-full flex items-center justify-center gap-3 py-4 text-xl">
            <MessageCircle size={24} /> Send via WhatsApp
          </button>

          <button onClick={shareNative} className="bg-primary-foreground/10 backdrop-blur-md text-primary-foreground font-semibold rounded-2xl px-8 py-4 text-lg transition-all hover:bg-primary-foreground/20 w-full flex items-center justify-center gap-2 border border-white/20">
            <Share2 size={20} /> Copy Share Link
          </button>

          <div className="pt-6 border-t border-white/10">
            <button
              onClick={() => navigate(`/verify/${wheel.id}`)}
              className="btn-gold w-full flex items-center justify-center gap-2 py-4"
            >
              📋 View Your Eidi Claims
            </button>
          </div>
        </div>
      </div>
    </EidBackground>
  );
}
