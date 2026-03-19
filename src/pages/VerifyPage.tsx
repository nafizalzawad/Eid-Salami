import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import EidBackground from '@/components/EidBackground';
import { getWheel, WheelData } from '@/lib/wheelStore';
import { CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

const MOBILE_BANKING_APPS = [
  { name: 'bKash', color: '#E2136E', icon: '📱', ussd: '*247#' },
  { name: 'Nagad', color: '#F6921E', icon: '📲', ussd: '*167#' },
  { name: 'Rocket', color: '#8B2F8B', icon: '🚀', ussd: '*322#' },
  { name: 'Upay', color: '#00A651', icon: '💳', ussd: '' },
];

export default function VerifyPage() {
  const { wheelId } = useParams<{ wheelId: string }>();
  const navigate = useNavigate();
  const [wheel, setWheel] = useState<WheelData | null>(null);
  const [claims, setClaims] = useState<Array<{ visitorId: string; segmentIndex: number; claimedAt: number }>>([]);
  const [verified, setVerified] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!wheelId) return;
    const w = getWheel(wheelId);
    if (!w) { navigate('/'); return; }
    setWheel(w);

    // Load claims from localStorage
    try {
      const results = JSON.parse(localStorage.getItem('eidi_results') || '[]');
      const wheelClaims = results.filter((r: any) => r.wheelId === wheelId);
      setClaims(wheelClaims);
    } catch { /* empty */ }

    // Load verified states
    try {
      const v = JSON.parse(localStorage.getItem(`eidi_verified_${wheelId}`) || '{}');
      setVerified(v);
    } catch { /* empty */ }
  }, [wheelId, navigate]);

  const toggleVerify = (visitorId: string) => {
    const next = { ...verified, [visitorId]: !verified[visitorId] };
    setVerified(next);
    localStorage.setItem(`eidi_verified_${wheelId}`, JSON.stringify(next));
  };

  if (!wheel) return null;

  return (
    <EidBackground>
      <div className="min-h-screen px-4 py-6 flex flex-col items-center">
        <button
          onClick={() => navigate(`/share/${wheelId}`)}
          className="self-start flex items-center gap-1 text-primary-foreground/60 hover:text-primary-foreground/80 text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Share
        </button>

        <h1 className="font-display text-2xl font-bold text-center mb-1">
          Eidi Claims 📋
        </h1>
        <p className="text-primary-foreground/60 text-sm mb-6 text-center">
          Verify and send Eidi via mobile banking
        </p>

        {claims.length === 0 ? (
          <div className="card-festive text-center py-8">
            <div className="text-4xl mb-3">🌙</div>
            <p className="text-muted-foreground">No one has spun yet… share your wheel! 😄</p>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-3">
            {claims.map((claim, i) => {
              const seg = wheel.segments[claim.segmentIndex];
              const isVerified = verified[claim.visitorId];
              return (
                <div key={i} className={`card-festive transition-all ${isVerified ? 'border-primary/30' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-foreground font-display font-bold text-lg">
                        {seg.amount !== '0' ? `${seg.amount} ৳` : 'Fun message'}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {seg.message} · Claimed {new Date(claim.claimedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleVerify(claim.visitorId)}
                      className={`flex items-center gap-1 text-sm font-semibold rounded-xl px-3 py-1.5 transition-all ${
                        isVerified
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted text-muted-foreground hover:bg-accent/20'
                      }`}
                    >
                      {isVerified ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {isVerified ? 'Sent' : 'Mark Sent'}
                    </button>
                  </div>

                  {!isVerified && seg.amount !== '0' && (
                    <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border">
                      {MOBILE_BANKING_APPS.map(app => (
                        <button
                          key={app.name}
                          className="rounded-lg p-2 text-center text-xs font-medium border border-border hover:scale-105 transition-transform"
                          style={{ backgroundColor: app.color + '10' }}
                          onClick={() => {
                            if (app.ussd) {
                              window.open(`tel:${app.ussd}`, '_self');
                            }
                          }}
                        >
                          <span className="text-base">{app.icon}</span>
                          <p className="text-foreground mt-0.5">{app.name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 card-festive w-full max-w-md">
          <p className="text-xs text-muted-foreground text-center">
            💡 When someone shares their Eidi card with you, verify the amount here and send it through your preferred mobile banking app. Then mark it as "Sent"!
          </p>
        </div>
      </div>
    </EidBackground>
  );
}
