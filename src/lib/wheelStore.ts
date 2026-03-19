import { v4 as uuidv4 } from 'uuid';

export interface WheelSegment {
  id: string;
  amount: string;
  message: string;
  color: string;
}

export interface WheelData {
  id: string;
  senderName: string;
  eidMessage: string;
  segments: WheelSegment[];
  createdAt: number;
}

export interface SpinResult {
  wheelId: string;
  visitorId: string;
  segmentIndex: number;
  claimedAt: number;
  themeId?: string;
}

const WHEELS_KEY = 'eidi_wheels';
const RESULTS_KEY = 'eidi_results';

const EID_COLORS = [
  'hsl(150, 60%, 30%)',
  'hsl(45, 90%, 55%)',
  'hsl(150, 50%, 45%)',
  'hsl(40, 85%, 65%)',
  'hsl(160, 55%, 35%)',
  'hsl(35, 80%, 50%)',
  'hsl(145, 45%, 40%)',
  'hsl(50, 85%, 60%)',
  'hsl(155, 50%, 28%)',
  'hsl(42, 88%, 52%)',
  'hsl(148, 55%, 38%)',
  'hsl(38, 82%, 58%)',
];

export function getRandomColors(count: number): string[] {
  const colors: string[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(EID_COLORS[i % EID_COLORS.length]);
  }
  return colors;
}

export function shuffleColors(): string[] {
  return [...EID_COLORS].sort(() => Math.random() - 0.5);
}

export function createDefaultSegments(): WheelSegment[] {
  const defaults = [
    { amount: '50', message: 'Eidi Mubarak! 💚' },
    { amount: '100', message: 'Double Eidi! 🎉' },
    { amount: '20', message: 'A little treat 😊' },
    { amount: '200', message: 'Jackpot! 🌟' },
    { amount: '0', message: 'Try next year 😄' },
    { amount: '75', message: 'Sweet Eidi! 🍬' },
  ];
  const colors = getRandomColors(defaults.length);
  return defaults.map((d, i) => ({
    id: uuidv4(),
    amount: d.amount,
    message: d.message,
    color: colors[i],
  }));
}

export function saveWheel(wheel: WheelData): void {
  const wheels = getAllWheels();
  wheels[wheel.id] = wheel;
  localStorage.setItem(WHEELS_KEY, JSON.stringify(wheels));
}

export function getWheel(id: string): WheelData | null {
  const wheels = getAllWheels();
  return wheels[id] || null;
}

function getAllWheels(): Record<string, WheelData> {
  try {
    return JSON.parse(localStorage.getItem(WHEELS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getVisitorId(): string {
  let id = localStorage.getItem('eidi_visitor_id');
  if (!id) {
    id = uuidv4();
    localStorage.setItem('eidi_visitor_id', id);
  }
  return id;
}

export function saveSpinResult(result: SpinResult): void {
  const results = getAllResults();
  results.push(result);
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

export function getSpinResult(wheelId: string, visitorId: string): SpinResult | null {
  const results = getAllResults();
  return results.find(r => r.wheelId === wheelId && r.visitorId === visitorId) || null;
}

function getAllResults(): SpinResult[] {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) || '[]');
  } catch {
    return [];
  }
}

export function getShareUrl(wheelId: string): string {
  return `${window.location.origin}/spin/${wheelId}`;
}

export function getShareText(senderName: string, url: string): string {
  return `Eid Mubarak! 🎉\n\nI made a fun Eidi wheel for you 😄\nSpin and see what you get:\n\n${url}\n\nDon't forget to send me one back 😏`;
}
