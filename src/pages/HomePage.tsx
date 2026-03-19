import { useNavigate } from 'react-router-dom';
import EidBackground from '@/components/EidBackground';
import Lantern from '@/components/Lantern';
import SpinningWheel from '@/components/SpinningWheel';
import { createDefaultSegments } from '@/lib/wheelStore';

export default function HomePage() {
  const navigate = useNavigate();
  const demoSegments = createDefaultSegments();

  return (
    <EidBackground>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="flex gap-4 mb-4">
          <Lantern className="opacity-70" />
          <Lantern className="opacity-50" style-delay="0.5s" />
        </div>

        <h1 className="font-display text-4xl md:text-5xl font-extrabold text-center mb-3 leading-tight">
          Send Eidi in a<br />Fun Way 🎉
        </h1>

        <p className="text-center text-primary-foreground/80 text-lg mb-8 max-w-xs">
          Create a spinning wheel, share it with loved ones, and let them win Eidi! 🌙
        </p>

        <div className="mb-8 opacity-90 pointer-events-none">
          <SpinningWheel segments={demoSegments} size={220} />
        </div>

        <button
          onClick={() => navigate('/create')}
          className="btn-gold text-xl mb-4 w-full max-w-xs"
        >
          ✨ Create Your Wheel
        </button>

        <button
          onClick={() => navigate('/demo')}
          className="bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground font-semibold rounded-2xl px-8 py-3 text-base transition-all hover:bg-primary-foreground/20 w-full max-w-xs"
        >
          🎯 Try Demo Spin
        </button>

        <p className="mt-8 text-sm text-primary-foreground/50 text-center">
          No login needed · Free · Made with 💚
        </p>
      </div>
    </EidBackground>
  );
}
