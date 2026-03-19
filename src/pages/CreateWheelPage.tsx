import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import EidBackground from '@/components/EidBackground';
import SpinningWheel from '@/components/SpinningWheel';
import { WheelSegment, WheelData, createDefaultSegments, shuffleColors, saveWheel, getRandomColors } from '@/lib/wheelStore';
import { Plus, Shuffle, Trash2 } from 'lucide-react';

export default function CreateWheelPage() {
  const navigate = useNavigate();
  const [senderName, setSenderName] = useState('');
  const [eidMessage, setEidMessage] = useState('');
  const [segments, setSegments] = useState<WheelSegment[]>(createDefaultSegments);

  const addSegment = () => {
    if (segments.length >= 12) return;
    const colors = getRandomColors(segments.length + 1);
    setSegments([...segments, {
      id: uuidv4(),
      amount: '50',
      message: 'Eidi! 🎁',
      color: colors[segments.length],
    }]);
  };

  const removeSegment = (id: string) => {
    if (segments.length <= 3) return;
    setSegments(segments.filter(s => s.id !== id));
  };

  const updateSegment = (id: string, field: 'amount' | 'message', value: string) => {
    setSegments(segments.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const randomizeColors = () => {
    const colors = shuffleColors();
    setSegments(segments.map((s, i) => ({ ...s, color: colors[i % colors.length] })));
  };

  const generate = () => {
    if (!senderName.trim()) return;
    const wheel: WheelData = {
      id: uuidv4(),
      senderName: senderName.trim(),
      eidMessage: eidMessage.trim(),
      segments,
      createdAt: Date.now(),
    };
    saveWheel(wheel);
    navigate(`/share/${wheel.id}`);
  };

  return (
    <EidBackground>
      <div className="min-h-screen px-4 py-6 flex flex-col items-center">
        <h1 className="font-display text-3xl font-bold mb-6 text-center">
          Create Your Eidi Wheel 🎁
        </h1>

        <div className="w-full max-w-md space-y-4">
          {/* Sender Info */}
          <div className="card-festive space-y-3">
            <input
              type="text"
              placeholder="Your Name *"
              value={senderName}
              onChange={e => setSenderName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-body text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={30}
            />
            <input
              type="text"
              placeholder="Eid Message (optional)"
              value={eidMessage}
              onChange={e => setEidMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted text-foreground font-body text-base border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={60}
            />
          </div>

          {/* Preview */}
          <div className="flex justify-center py-2">
            <SpinningWheel segments={segments} size={200} />
          </div>

          {/* Segments Editor */}
          <div className="card-festive">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg font-bold text-foreground">Segments</h2>
              <button onClick={randomizeColors} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Shuffle size={14} /> Colors
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {segments.map((seg, i) => (
                <div key={seg.id} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <input
                    type="text"
                    value={seg.amount}
                    onChange={e => updateSegment(seg.id, 'amount', e.target.value)}
                    className="w-16 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:outline-none"
                    placeholder="৳"
                  />
                  <input
                    type="text"
                    value={seg.message}
                    onChange={e => updateSegment(seg.id, 'message', e.target.value)}
                    className="flex-1 px-2 py-1.5 rounded-lg bg-muted text-foreground text-sm border border-border focus:outline-none"
                    placeholder="Message"
                    maxLength={30}
                  />
                  <button
                    onClick={() => removeSegment(seg.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    disabled={segments.length <= 3}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {segments.length < 12 && (
              <button
                onClick={addSegment}
                className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <Plus size={16} /> Add Segment
              </button>
            )}
          </div>

          {/* Generate */}
          <button
            onClick={generate}
            disabled={!senderName.trim()}
            className="btn-gold w-full text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🎉 Generate Eidi Link
          </button>
        </div>
      </div>
    </EidBackground>
  );
}
