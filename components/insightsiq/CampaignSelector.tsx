'use client';

import { useState, useRef, useEffect } from 'react';
import { useInsightsIQCampaigns } from '@/hooks/use-insightsiq';

// Design tokens — match reach-stats P palette
const S = {
  border: "rgba(0,0,0,0.08)",
  text1: "#1d1d1f",
  text2: "#6e6e73",
  text3: "#aeaeb2",
  accent: "#7C3AED",
  accentSoft: "rgba(124,58,237,0.07)",
};

interface CampaignSelectorProps {
  value?: string[];
  onChange?: (ids: string[]) => void;
}

export function CampaignSelector({ value, onChange }: CampaignSelectorProps = {}) {
  const { data: apiCampaigns, isLoading } = useInsightsIQCampaigns();

  // Map API campaigns (numeric id) to component format (string id)
  const campaigns = (apiCampaigns || []).map((c) => ({
    id: String(c.id),
    name: c.name,
  }));

  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState<string[]>([]);
  const selectedCampaigns = value ?? internalSelected;
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectCampaign = (campaignId: string) => {
    setInternalSelected([campaignId]);
    onChange?.([campaignId]);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (isLoading) return 'Loading...';
    if (campaigns.length === 0) return 'No campaigns';
    if (selectedCampaigns.length === 1) {
      return campaigns.find(c => c.id === selectedCampaigns[0])?.name || 'Select Campaign';
    }
    return 'Select Campaign';
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px', borderRadius: 8,
          background: 'rgba(255,255,255,0.8)',
          border: `1px solid ${S.border}`,
          cursor: isLoading ? 'default' : 'pointer', fontSize: 13, fontWeight: 500,
          color: S.text1, minWidth: 200,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        <span style={{ fontSize: 10, color: S.accent, fontWeight: 600 }}>▶</span>
        <span style={{ flex: 1, textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {getDisplayText()}
        </span>
        <span
          style={{
            fontSize: 9, color: S.text3,
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        >
          ▼
        </span>
      </button>

      {isOpen && campaigns.length > 0 && (
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 4px)', left: 0,
            minWidth: 260, background: '#fff', borderRadius: 10,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: `1px solid ${S.border}`,
            zIndex: 200, padding: '6px 0', maxHeight: 300, overflowY: 'auto',
          }}
        >
          {campaigns.map((campaign) => {
            const selected = selectedCampaigns.includes(campaign.id);
            return (
              <button
                key={campaign.id}
                onClick={() => selectCampaign(campaign.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '9px 14px', border: 'none',
                  background: selected ? S.accentSoft : 'transparent',
                  cursor: 'pointer', fontSize: 13, textAlign: 'left',
                  transition: 'background 0.15s',
                }}
              >
                <span
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: '#34D399', flexShrink: 0,
                  }}
                />
                <span style={{ flex: 1, fontWeight: selected ? 600 : 400, color: S.text1 }}>
                  {campaign.name}
                </span>
                {selected && (
                  <span style={{ fontSize: 12, color: S.accent, fontWeight: 700 }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
