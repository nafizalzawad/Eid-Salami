import { useMemo } from 'react';

export default function EidBackground({ children }: { children: React.ReactNode }) {
  const stars = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 60,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="eid-gradient-bg min-h-screen text-primary-foreground">
      {stars.map(s => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {/* Crescent moon */}
      <div className="absolute top-8 right-8 crescent animate-float opacity-80" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
