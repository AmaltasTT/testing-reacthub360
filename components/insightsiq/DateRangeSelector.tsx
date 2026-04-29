'use client';

import { useState, useRef, useEffect } from 'react';

// Design tokens — match reach-stats P palette
const S = {
  border: "rgba(0,0,0,0.08)",
  divider: "rgba(0,0,0,0.06)",
  text1: "#1d1d1f",
  text2: "#6e6e73",
  text3: "#aeaeb2",
  accent: "#7C3AED",
  accentSoft: "rgba(124,58,237,0.07)",
};

export type DateRangePreset = 7 | 14 | 30 | 60 | 90 | 'custom';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

const presets: { value: Exclude<DateRangePreset, 'custom'>; label: string }[] = [
  { value: 7,  label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
  { value: 60, label: '60 days' },
  { value: 90, label: '90 days' },
];

function toInputValue(date: Date | null): string {
  if (!date) return '';
  return date.toISOString().slice(0, 10);
}

function fromInputValue(val: string): Date | null {
  if (!val) return null;
  const d = new Date(val + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

interface DateRangeSelectorProps {
  value?: DateRangePreset;
  customRangeValue?: DateRange;
  onChange?: (preset: DateRangePreset, range: DateRange) => void;
}

export function DateRangeSelector({ value, customRangeValue, onChange }: DateRangeSelectorProps = {}) {
  const [internalPreset, setInternalPreset] = useState<DateRangePreset>(7);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  // Draft strings are fully local — independent of the controlled customRangeValue prop
  const [draftFrom, setDraftFrom] = useState('');
  const [draftTo, setDraftTo] = useState('');

  const selectedPreset = value ?? internalPreset;
  const committedRange = customRangeValue ?? { start: null, end: null };
  const customRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (customRef.current && !customRef.current.contains(event.target as Node)) {
        setShowCustomPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openCustomPicker = () => {
    // Seed drafts from the last committed range so edits start from known state
    setDraftFrom(toInputValue(committedRange.start));
    setDraftTo(toInputValue(committedRange.end));
    setShowCustomPicker((v) => !v);
  };

  const handlePresetSelect = (preset: Exclude<DateRangePreset, 'custom'>) => {
    setInternalPreset(preset);
    setShowCustomPicker(false);
    onChange?.(preset, committedRange);
  };

  const handleApply = () => {
    const newRange: DateRange = {
      start: fromInputValue(draftFrom),
      end: fromInputValue(draftTo),
    };
    setShowCustomPicker(false);
    onChange?.('custom', newRange);
  };

  const customLabel = () => {
    if (committedRange.start && committedRange.end) {
      const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${fmt(committedRange.start)} – ${fmt(committedRange.end)}`;
    }
    return 'Custom';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Divider before date controls */}
      <div style={{ width: 1, height: 24, background: S.divider }} />

      {/* ── Period pills ── */}
      <div
        style={{
          display: 'flex', gap: 0,
          background: 'rgba(255,255,255,0.6)',
          borderRadius: 8, border: `1px solid ${S.border}`, overflow: 'hidden',
        }}
      >
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePresetSelect(p.value)}
            style={{
              padding: '7px 14px', border: 'none', fontSize: 12,
              fontWeight: selectedPreset === p.value ? 600 : 400,
              background: selectedPreset === p.value ? S.accent : 'transparent',
              color: selectedPreset === p.value ? '#fff' : S.text2,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Custom date button + picker ── */}
      <div ref={customRef} style={{ position: 'relative' }}>
        <button
          onClick={openCustomPicker}
          style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 12,
            fontWeight: selectedPreset === 'custom' ? 600 : 400,
            background: selectedPreset === 'custom' ? S.accent : 'rgba(255,255,255,0.6)',
            color: selectedPreset === 'custom' ? '#fff' : S.text2,
            border: `1px solid ${selectedPreset === 'custom' ? S.accent : S.border}`,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            transition: 'all 0.2s',
          }}
        >
          <span style={{ fontSize: 11 }}>📅</span>
          {selectedPreset === 'custom' ? customLabel() : 'Custom'}
        </button>

        {showCustomPicker && (
          <div
            style={{
              position: 'absolute', top: 'calc(100% + 4px)', right: 0,
              background: '#fff', borderRadius: 10,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: `1px solid ${S.border}`,
              zIndex: 200, padding: 16,
              display: 'flex', gap: 12, alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: S.text3, marginBottom: 4, fontWeight: 500 }}>From</div>
              <input
                type="date"
                value={draftFrom}
                onChange={(e) => setDraftFrom(e.target.value)}
                style={{
                  padding: '6px 10px', borderRadius: 6,
                  border: `1px solid ${S.border}`, fontSize: 12,
                  color: S.text1, outline: 'none',
                }}
              />
            </div>
            <span style={{ color: S.text3, marginTop: 16 }}>→</span>
            <div>
              <div style={{ fontSize: 11, color: S.text3, marginBottom: 4, fontWeight: 500 }}>To</div>
              <input
                type="date"
                value={draftTo}
                onChange={(e) => setDraftTo(e.target.value)}
                style={{
                  padding: '6px 10px', borderRadius: 6,
                  border: `1px solid ${S.border}`, fontSize: 12,
                  color: S.text1, outline: 'none',
                }}
              />
            </div>
            <button
              onClick={handleApply}
              style={{
                padding: '6px 14px', borderRadius: 6, border: 'none',
                background: S.accent, color: '#fff', fontSize: 12,
                fontWeight: 600, cursor: 'pointer', marginTop: 16,
              }}
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
