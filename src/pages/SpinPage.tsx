import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import EidBackground from '@/components/EidBackground';
import SpinningWheel from '@/components/SpinningWheel';
import EidiCard from '@/components/EidiCard';
import { getWheel, getVisitorId, getSpinResult, saveSpinResult, WheelData, WheelSegment, SpinResult } from '@/lib/wheelStore';
import { getRandomTheme } from '@/lib/cardThemes';
import { CheckCircle2, Smartphone } from 'lucide-react';

const MOBILE_BANKING_APPS = [
  { name: 'bKash', color: '#E2136E', icon: '📱' },
  { name: 'Nagad', color: '#F6921E', icon: '📲' },
  { name: 'Rocket', color: '#8B2F8B', icon: '🚀' },
  { name: 'Upay', color: '#00A651', icon: '💳' },
];

export default function SpinPage() {
  const { wheelId } = useParams<{ wheelId: string }>();
  const navigate = useNavigate();
  const [wheel, setWheel] = useState<WheelData | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [previousResult, setPreviousResult] = useState<WheelSegment | null>(null);
  const [themeId, setThemeId] = useState<string | undefined>(undefined);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  useEffect(() => {
    if (!wheelId) return;
    const w = getWheel(wheelId);
    if (!w) {
      navigate('/');
      return;
    }
    setWheel(w);

    const visitorId = getVisitorId();
    const existing = getSpinResult(wheelId, visitorId);
    if (existing) {
      setAlreadyClaimed(true);
      setPreviousResult(w.segments[existing.segmentIndex]);
      setThemeId(existing.themeId);
    }
  }, [wheelId, navigate]);

  const fireConfetti = () => {
    const defaults = { spread: 360, ticks: 100, gravity: 0.5, decay: 0.94, startVelocity: 30 };
    confetti({ ...defaults, particleCount: 50, origin: { x: 0.3, y: 0.5 }, colors: ['#2d8a4e', '#d4a017', '#f0c040'] });
    confetti({ ...defaults, particleCount: 50, origin: { x: 0.7, y: 0.5 }, colors: ['#2d8a4e', '#d4a017', '#f0c040'] });
    setTimeout(() => {
      confetti({ ...defaults, particleCount: 80, origin: { x: 0.5, y: 0.3 }, colors: ['#2d8a4e', '#d4a017', '#fff'] });
    }, 300);
  };

  const handleSpinEnd = useCallback((segmentIndex: number) => {
    if (!wheel || !wheelId) return;
    const seg = wheel.segments[segmentIndex];
    const initialThemeId = getRandomTheme().id;
    setThemeId(initialThemeId);
    setResult(seg);
    setSpinning(false);

    saveSpinResult({
      wheelId,
      visitorId: getVisitorId(),
      segmentIndex,
      claimedAt: Date.now(),
      themeId: initialThemeId,
    });

    fireConfetti();
  }, [wheel, wheelId]);

  const startSpin = () => {
    if (spinning || result) return;
    setSpinning(true);
  };

  const shareCardToSender = (segment: WheelSegment) => {
    const text = `Eid Mubarak! 🎉\nI spun your Eidi Wheel and got ${segment.amount !== '0' ? segment.amount + ' ৳' : 'a special message'}! 🎁\n\n"${segment.message}"\n\nPlease send my Eidi via mobile banking 😄💚`;
    if (navigator.share) {
      navigator.share({ title: 'Eidi Claim 🎁', text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  if (!wheel) return null;

  // Already claimed view
  if (alreadyClaimed && previousResult) {
    return (
      <EidBackground>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 text-center">
          <div className="animate-bounce-in mb-6">
            <div className="text-5xl mb-3">🎁</div>
            <h1 className="font-display text-2xl font-bold mb-1">
              You've already claimed your Eidi!
            </h1>
            <p className="text-primary-foreground/60 text-sm mb-4">
              From {wheel.senderName} 💚
            </p>
          </div>

          <EidiCard
            amount={previousResult.amount}
            message={previousResult.message}
            senderName={wheel.senderName}
            eidMessage={wheel.eidMessage}
            themeId={themeId}
          />

          <div className="mt-4 space-y-3 w-full max-w-sm">
            <button
              onClick={() => shareCardToSender(previousResult)}
              className="btn-festive w-full flex items-center justify-center gap-2 text-base"
            >
              <Smartphone size={18} /> Send to {wheel.senderName} to Claim
            </button>

            <button
              onClick={() => navigate('/create')}
              className="text-primary-foreground/50 hover:text-primary-foreground/70 text-sm transition-colors w-full text-center"
            >
              ✨ Create Your Own Eidi Wheel
            </button>
          </div>
        </div>
      </EidBackground>
    );
  }

  // Result screen with Eid Card
  if (result) {
    return (
      <EidBackground>
        <div className="min-h-screen flex flex-col items-center px-4 py-8">
          <div className="animate-bounce-in text-center mb-4">
            <div className="text-5xl mb-2">🎉</div>
            <h1 className="font-display text-3xl font-extrabold">
              Eidi Mubarak!
            </h1>
            <p className="text-primary-foreground/60 text-sm mt-1">
              From {wheel.senderName} 💚
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <EidiCard
              amount={result.amount}
              message={result.message}
              senderName={wheel.senderName}
              eidMessage={wheel.eidMessage}
              themeId={themeId}
            />
          </div>

          {/* Claim & Payment Section */}
          {result.amount !== '0' && (
            <div className="w-full max-w-sm mt-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {!showPaymentInfo ? (
                <button
                  onClick={() => {
                    shareCardToSender(result);
                    setShowPaymentInfo(true);
                  }}
                  className="btn-festive w-full flex items-center justify-center gap-2 text-base"
                >
                  <Smartphone size={18} /> Send Card to {wheel.senderName} to Claim
                </button>
              ) : (
                <div className="card-festive space-y-3">
                  <div className="flex items-center gap-2 text-foreground font-display font-bold text-base">
                    <CheckCircle2 size={20} className="text-primary" />
                    Card shared! Now ask {wheel.senderName} to send via:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {MOBILE_BANKING_APPS.map(app => (
                      <div
                        key={app.name}
                        className="rounded-xl p-3 text-center font-semibold text-sm border border-border hover:scale-105 transition-transform cursor-pointer"
                        style={{ backgroundColor: app.color + '15', borderColor: app.color + '30' }}
                      >
                        <span className="text-lg">{app.icon}</span>
                        <p className="text-foreground mt-1">{app.name}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Show this card to {wheel.senderName} — they'll verify and send {result.amount} ৳ via mobile banking 💚
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => navigate('/create')}
            className="btn-gold mt-5"
          >
            😄 Send Eidi Back
          </button>
        </div>
      </EidBackground>
    );
  }

  // Spin screen
  return (
    <EidBackground>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="animate-slide-up text-center mb-6">
          <div className="text-4xl mb-2">💚</div>
          <h1 className="font-display text-2xl font-bold">
            Eidi from {wheel.senderName}
          </h1>
          {wheel.eidMessage && (
            <p className="text-primary-foreground/70 mt-1 text-base italic">
              "{wheel.eidMessage}"
            </p>
          )}
        </div>

        <div className="mb-8">
          <SpinningWheel
            segments={wheel.segments}
            spinning={spinning}
            onSpinEnd={handleSpinEnd}
            size={Math.min(320, window.innerWidth - 60)}
          />
        </div>

        <button
          onClick={startSpin}
          disabled={spinning}
          className="btn-gold text-xl animate-pulse-glow disabled:opacity-60"
        >
          {spinning ? '🎯 Spinning...' : '🎯 Spin Now!'}
        </button>
      </div>
    </EidBackground>
  );
}
