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

export const NAFIZ_WHEEL: WheelData = {
  id: 'nafiz-salami',
  senderName: 'Nafiz Al Zawad',
  eidMessage: 'May this Eid bring you endless joy and happiness. Here is a small token of my love! 💚🌙',
  createdAt: 1712707200000, // Fixed timestamp
  segments: [
    { id: 'seg-1', amount: '0.00', message: 'Try next year 😅', color: EID_COLORS[0] },
    { id: 'seg-2', amount: '0.50', message: 'A tiny treat 🙂', color: EID_COLORS[1] },
    { id: 'seg-3', amount: '1.00', message: 'Sweet Eidi 🍬', color: EID_COLORS[2] },
    { id: 'seg-4', amount: '1.75', message: 'Lucky you 🍀', color: EID_COLORS[3] },
    { id: 'seg-5', amount: '2.50', message: 'A little treat 😊', color: EID_COLORS[4] },
    { id: 'seg-6', amount: '3.50', message: 'Getting better 👀', color: EID_COLORS[5] },
    { id: 'seg-7', amount: '4.50', message: 'Nice one 😎', color: EID_COLORS[6] },
    { id: 'seg-8', amount: '6.00', message: 'Big smile 😄', color: EID_COLORS[7] },
    { id: 'seg-9', amount: '7.50', message: 'Double Eidi! 🎉', color: EID_COLORS[8] },
    { id: 'seg-10', amount: '9.75', message: 'Jackpot! 🌟', color: EID_COLORS[9] },
  ]
};

export function createDefaultSegments(): WheelSegment[] {
  return NAFIZ_WHEEL.segments;
}

export function saveWheel(wheel: WheelData): void {
  // Don't allowing overriding if we want to stick to Nafiz
  if (wheel.id === NAFIZ_WHEEL.id) return;
  const wheels = getAllWheels();
  wheels[wheel.id] = wheel;
  localStorage.setItem(WHEELS_KEY, JSON.stringify(wheels));
}

export function getWheel(id: string): WheelData | null {
  if (id === NAFIZ_WHEEL.id || id === 'nafiz') return NAFIZ_WHEEL;
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
  if (wheelId === NAFIZ_WHEEL.id || wheelId === 'nafiz-salami') {
    return window.location.origin;
  }
  return `${window.location.origin}/spin/${wheelId}`;
}

export function getShareText(senderName: string, url: string): string {
  return `Eid Mubarak! 🎉\n\nI made a fun Eidi wheel for you 😄\nSpin and see what you get:\n\n${url}\n\nDon't forget to send me one back 😏`;
}
