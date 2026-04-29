'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { PhaseCard } from '@/components/insightsiq/PhaseCard';
import { CampaignSelector } from '@/components/insightsiq/CampaignSelector';
import { GeographySelector } from '@/components/insightsiq/GeographySelector';
import { DateRangeSelector, type DateRangePreset, type DateRange } from '@/components/insightsiq/DateRangeSelector';
import { BrandMomentum } from '@/components/insightsiq/BrandMomentum';
import { PulsatingDivider } from '@/components/insightsiq/PulsatingDivider';
import { Info, ArrowDown, ArrowUp, AlertTriangle } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import {
  useInsightsIQBrandMomentum,
  useInsightsIQPerformanceSnapshot,
  useInsightsIQKeyInsights,
  useInsightsIQPhasesOverview,
  useInsightsIQPhaseReach,
  useInsightsIQPhaseEngage,
  useInsightsIQPhaseAct,
  useInsightsIQPhaseConvert,
  useInsightsIQPhaseTalk,
  type InsightsFilters,
  type PhaseMetric,
} from '@/hooks/use-insightsiq';
import {
  readCampaignIdFromSearchParams,
  writeCampaignIdToSearchParams,
  buildUrlWithSearchString,
} from '@/lib/insights-campaign-url';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}

// Fallback phases data when the overview API returns nothing or is loading
const fallbackPhasesData = [
  {
    name: 'Reach',
    status: 'Healthy' as const,
    metrics: [
      { label: 'Total Reach', value: '—' },
      { label: 'Engaged Reach', value: '—' },
      { label: 'Cost per Unique', value: '—' }
    ],
    momentum: '+0%',
    sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    primaryMetrics: [
      { label: 'Qualified Reach', value: '—', delta: '' },
      { label: 'Cost per Qualified Reach (CpQR)', value: '—', delta: '' },
      { label: 'Qualified Reach Rate', value: '—', delta: '' },
      { label: 'Audience Penetration Rate', value: '—', delta: '' }
    ],
    supportingMetrics: [
      { label: 'Impressions', value: '—' },
      { label: 'Viewable Impressions', value: '—' },
      { label: 'CPM', value: '—' },
      { label: 'vCPM', value: '—' }
    ],
    ctaLabel: 'Explore Reach Drivers',
    expandedContent: {
      additionalMetrics: [],
      row3Metrics: [
        { label: 'Frequency', value: '—' },
        { label: 'Total Reach (Platform)', value: '—' },
        { label: 'Total Reach by Device', value: '—', deviceBreakdown: { desktop: '—', mobile: '—' } }
      ]
    }
  },
  {
    name: 'Engage',
    status: 'Improving' as const,
    metrics: [
      { label: 'ENGAGEMENT IMPACT SCORE', value: '—', delta: '' },
      { label: 'ENGAGEMENT QUALITY (EQS)', value: '—', delta: '' },
      { label: 'ENGAGEMENT STICKINESS RATE', value: '—', delta: '' },
      { label: 'COST PER QUALIFIED ENGAGEMENT (CPQE)', value: '—', delta: '' }
    ],
    momentum: '+0%',
    sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    supportingMetrics: [
      { label: 'ENGAGEMENT IMPACT SCORE', value: '—', delta: '' },
      { label: 'ENGAGEMENT QUALITY (EQS)', value: '—', delta: '' },
      { label: 'ENGAGEMENT STICKINESS RATE', value: '—', delta: '' },
      { label: 'COST PER QUALIFIED ENGAGEMENT (CPQE)', value: '—', delta: '' }
    ],
    expandedContent: { additionalMetrics: [] }
  },
  {
    name: 'Act',
    status: 'Improving' as const,
    metrics: [
      { label: 'ACTION COMPLETION RATE', value: '—', delta: '' },
      { label: 'ACTION IMPACT (AIS)', value: '—', delta: '' },
      { label: 'ACTION QUALITY (AQS)', value: '—', delta: '' },
      { label: 'COST PER ACTION', value: '—', delta: '' }
    ],
    momentum: '+0%',
    sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expandedContent: { additionalMetrics: [] }
  },
  {
    name: 'Convert',
    status: 'On Track' as const,
    metrics: [
      { label: 'CONVERSION RATE', value: '—', delta: '' },
      { label: 'COST PER CONVERSION', value: '—', delta: '' },
      { label: 'REVENUE', value: '—', delta: '' },
      { label: 'AVG ORDER VALUE', value: '—', delta: '' }
    ],
    momentum: '+0%',
    sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expandedContent: { additionalMetrics: [] }
  },
  {
    name: 'Talk',
    status: 'Caution' as const,
    metrics: [
      { label: 'CUSTOMER RETENTION RATE', value: '—', delta: '' },
      { label: 'COST PER RETAINED CUSTOMER', value: '—', delta: '' },
      { label: 'ADVOCACY ACTION RATE', value: '—', delta: '' },
      { label: 'COST PER ADVOCACY ACTION', value: '—', delta: '' }
    ],
    momentum: '+0%',
    sparklineData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    expandedContent: { additionalMetrics: [] }
  }
];

function computeDateRange(period: DateRangePreset, customRange: DateRange): { dateFrom?: string; dateTo?: string } {
  if (period === 'custom') {
    return {
      dateFrom: customRange.start?.toISOString().split('T')[0],
      dateTo: customRange.end?.toISOString().split('T')[0],
    };
  }
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - period);
  return {
    dateFrom: from.toISOString().split('T')[0],
    dateTo: now.toISOString().split('T')[0],
  };
}

export default function InsightsIQPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: user, isLoading: isUserLoading } = useUser();
  const [greeting, setGreeting] = useState('Good morning');

  // Filter state
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [selectedGeography, setSelectedGeography] = useState<string>('global');
  const [selectedPeriod, setSelectedPeriod] = useState<DateRangePreset>(7);
  const [customRange, setCustomRange] = useState<DateRange>({ start: null, end: null });

  // Expanded phase state for lazy loading detail APIs
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  const urlCampaignId = useMemo(
    () => readCampaignIdFromSearchParams(searchParams),
    [searchParams.toString()]
  );

  const prevUrlCampaignRef = useRef<string | undefined>(undefined);

  /** Keep filter in sync with URL (LaunchIQ handoff, back/forward, shared links). */
  useEffect(() => {
    const id = urlCampaignId;
    if (id) {
      setSelectedCampaigns((prev) =>
        prev.length === 1 && prev[0] === id ? prev : [id]
      );
      prevUrlCampaignRef.current = id;
      return;
    }
    if (prevUrlCampaignRef.current !== undefined) {
      setSelectedCampaigns([]);
      prevUrlCampaignRef.current = undefined;
    }
  }, [urlCampaignId]);

  const handleCampaignChange = useCallback(
    (ids: string[]) => {
      setSelectedCampaigns(ids);
      const raw = ids[0]?.trim();
      const idForUrl = raw && Number.isFinite(Number(raw)) ? raw : undefined;
      const next = writeCampaignIdToSearchParams(searchParams, idForUrl);
      const href = buildUrlWithSearchString(pathname, next);
      const current = buildUrlWithSearchString(pathname, new URLSearchParams(searchParams.toString()));
      if (href !== current) router.replace(href, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  // Compute filters from state
  const filters: InsightsFilters = useMemo(() => {
    const { dateFrom, dateTo } = computeDateRange(selectedPeriod, customRange);
    return {
      campaign_ids: selectedCampaigns.map(Number).filter(Boolean),
      geography: selectedGeography,
      date_from: dateFrom,
      date_to: dateTo,
    };
  }, [selectedCampaigns, selectedGeography, selectedPeriod, customRange]);

  const hasCampaignFilter = true;
    //selectedCampaigns.length > 0 && selectedCampaigns.some((id) => id.trim() !== "" && Number.isFinite(Number(id)));

  const brandMomentumFilters = useMemo(() => {
    const { dateFrom, dateTo } = computeDateRange(selectedPeriod, customRange);
    return { geography: selectedGeography, date_from: dateFrom, date_to: dateTo };
  }, [selectedGeography, selectedPeriod, customRange]);
  const { data: brandMomentumData, isLoading: isBrandMomentumLoading } = useInsightsIQBrandMomentum(brandMomentumFilters);
  const { data: performanceSnapshot, isPending: isSnapshotPending } = useInsightsIQPerformanceSnapshot(
    filters,
    hasCampaignFilter
  );
  const { data: keyInsights, isPending: isKeyInsightsPending } = useInsightsIQKeyInsights(filters, hasCampaignFilter);
  const { data: phasesOverview, isLoading: isPhasesLoading } = useInsightsIQPhasesOverview(filters, hasCampaignFilter);

  // Phase detail hooks (lazy-loaded on expand; require a chosen campaign)
  const { data: reachData, isLoading: isReachLoading } = useInsightsIQPhaseReach(
    filters,
    !!expandedPhases['Reach'] && hasCampaignFilter
  );
  const { data: engageData, isLoading: isEngageLoading } = useInsightsIQPhaseEngage(
    filters,
    !!expandedPhases['Engage'] && hasCampaignFilter
  );
  const { data: actData, isLoading: isActLoading } = useInsightsIQPhaseAct(
    filters,
    !!expandedPhases['Act'] && hasCampaignFilter
  );
  const { data: convertData, isLoading: isConvertLoading } = useInsightsIQPhaseConvert(
    filters,
    !!expandedPhases['Convert'] && hasCampaignFilter
  );
  const { data: talkData, isLoading: isTalkLoading } = useInsightsIQPhaseTalk(
    filters,
    !!expandedPhases['Talk'] && hasCampaignFilter
  );

  const phaseDetailMap: Record<string, { data: any; isLoading: boolean }> = {
    Reach: { data: reachData, isLoading: isReachLoading },
    Engage: { data: engageData, isLoading: isEngageLoading },
    Act: { data: actData, isLoading: isActLoading },
    Convert: { data: convertData, isLoading: isConvertLoading },
    Talk: { data: talkData, isLoading: isTalkLoading },
  };

  // Map API phases overview to component format, fall back to fallback
  const phasesData = useMemo(() => {
    const reachLabelMap: Record<string, string> = {
      'Total Reach': 'Qualified Reach',
      'Cost per Reach (CPR)': 'Cost per Qualified Reach (CpQR)',
      'Engaged Reach': 'Qualified Reach Rate',
    };
    const remapReachLabels = (metrics: PhaseMetric[]): PhaseMetric[] =>
      metrics.map((m) => ({ ...m, label: reachLabelMap[m.label] ?? m.label }));
    const phases = phasesOverview?.phases;
    if (!phases || phases.length === 0) return fallbackPhasesData;

    return phases.map((phase, idx) => {
      const fallback = fallbackPhasesData.find(f => f.name === phase.name) || fallbackPhasesData[idx];
      const rawPrimary = phase.primary_metrics?.length ? phase.primary_metrics : (fallback as any).primaryMetrics;
      const primaryMetrics = phase.name === 'Reach' ? remapReachLabels(rawPrimary) : rawPrimary;
      return {
        name: phase.name,
        status: (phase.status || fallback.status) as any,
        metrics: primaryMetrics,
        momentum: phase.momentum || fallback.momentum,
        sparklineData: phase.sparkline_data?.length ? phase.sparkline_data : fallback.sparklineData,
        statusSubtitle: phase.status_subtitle,
        pulseDot: phase.pulse_dot,
        primaryMetrics,
        supportingMetrics: phase.supporting_metrics?.length ? phase.supporting_metrics : (fallback as any).supportingMetrics,
        ctaLabel: (fallback as any).ctaLabel,
        expandedContent: fallback.expandedContent,
      };
    });
  }, [phasesOverview]);

  const snapshot = performanceSnapshot;
  const effectiveKeyInsights = keyInsights;
  const effectiveBrandMomentumData = brandMomentumData;

  const isSnapshotSectionLoading = isSnapshotPending || isKeyInsightsPending;

  // QR Card data — maps to total_reach
  const qrPercent = snapshot?.total_reach?.percentage ?? 0;
  const qrValue = snapshot?.total_reach?.value ?? '—';
  const qrDelta = snapshot?.total_reach?.delta ?? null;

  // CpQR Card data — maps to cost_per_reach; target from total_spend_vs_roas
  const cpqrValue = snapshot?.cost_per_reach?.value ?? '—';
  const cpqrTargetVal = snapshot?.total_spend_vs_roas?.secondary_value ?? '—';
  const cpqrDelta = snapshot?.cost_per_reach?.delta ?? null;
  const cpqrIsBelow = !!(cpqrDelta && (cpqrDelta.startsWith('-') || cpqrDelta.startsWith('−')));

  // QRR Card data — uses total_reach percentage (% of target reached)
  const qrrPercent = snapshot?.total_reach?.percentage ?? 0;
  const qrrDelta = snapshot?.total_reach?.delta ?? null;

  // APR Card data — maps to audience_penetration_rate
  const aprPercent = snapshot?.audience_penetration_rate?.percentage ?? 0;
  const aprValue = snapshot?.audience_penetration_rate?.value ?? '—';
  const aprDelta = snapshot?.audience_penetration_rate?.delta ?? null;

  // Key insights — API returns key_insights / top_opportunities
  const insights = effectiveKeyInsights?.key_insights ?? [];
  const opportunities = effectiveKeyInsights?.top_opportunities ?? [];

  const userName = user?.first_name || 'there';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 p-6 md:p-10 lg:p-12 relative overflow-hidden">
      {/* Refined background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(167,139,250,0.03),transparent_60%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-14 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-5xl font-semibold tracking-tight bg-gradient-to-r from-[#5956E9] via-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent leading-tight" style={{ fontFamily: 'Montserrat, -apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: '-0.02em' }}>
                InsightsIQ
              </h1>
            </div>
            <p className="text-[#1d1d1f] text-3xl font-light mb-2" style={{ letterSpacing: '-0.01em' }}>
              {greeting}, {isUserLoading ? '...' : userName}
            </p>
            <p className="text-[#6e6e73] text-base font-normal">Monitor your funnel metrics at a glance</p>
          </div>

          {/* Campaign, Geography and Date Range Selectors */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto lg:justify-end">
            <CampaignSelector
              value={selectedCampaigns}
              onChange={handleCampaignChange}
            />
            <GeographySelector
              value={selectedGeography}
              onChange={setSelectedGeography}
            />
            <DateRangeSelector
              value={selectedPeriod}
              customRangeValue={customRange}
              onChange={(preset, range) => {
                setSelectedPeriod(preset);
                setCustomRange(range);
              }}
            />
          </div>
        </div>

        {/* Brand Momentum */}
        <BrandMomentum data={effectiveBrandMomentumData} isLoading={isBrandMomentumLoading} />

        {/* Pulsating Divider */}
        <PulsatingDivider />

        {/* Campaign Performance Snapshot Header */}
        <div className="mb-5">
          <h2 className="text-xl font-bold tracking-tight mb-1" style={{ color: '#1A1D2E', letterSpacing: '-0.02em' }}>Campaign Performance Snapshot</h2>
          <p className="text-xs" style={{ color: '#8B8FA3' }}>Key metrics driving your campaign goals</p>
        </div>

        {isSnapshotSectionLoading ? (
          <div style={{ marginBottom: '32px' }}>
            {/* KPI cards skeleton */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
              {[340, 1, 1, 1].map((w, i) => (
                <div key={i} style={{ width: w === 340 ? '340px' : undefined, flex: w === 1 ? '1 1 0' : undefined, minWidth: w === 1 ? '160px' : undefined, background: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)', padding: '24px 20px', height: '220px' }} className="animate-pulse">
                  <div style={{ height: '10px', width: '60%', background: '#EEEDF5', borderRadius: '5px', marginBottom: '16px' }} />
                  <div style={{ height: '40px', width: '50%', background: '#EEEDF5', borderRadius: '8px', margin: '0 auto 16px' }} />
                  <div style={{ height: '8px', width: '80%', background: '#EEEDF5', borderRadius: '5px', marginBottom: '10px' }} />
                  <div style={{ height: '8px', width: '60%', background: '#EEEDF5', borderRadius: '5px' }} />
                </div>
              ))}
            </div>
            {/* Row 2 skeleton */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
              <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)', padding: '24px', height: '200px' }} className="animate-pulse">
                <div style={{ height: '10px', width: '50%', background: '#EEEDF5', borderRadius: '5px', marginBottom: '20px' }} />
                <div style={{ height: '60px', background: '#EEEDF5', borderRadius: '10px', marginBottom: '12px' }} />
                <div style={{ height: '60px', background: '#EEEDF5', borderRadius: '10px' }} />
              </div>
              <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.06)', padding: '24px', height: '200px' }} className="animate-pulse">
                <div style={{ height: '10px', width: '40%', background: '#EEEDF5', borderRadius: '5px', marginBottom: '20px' }} />
                {[1,2,3].map(i => <div key={i} style={{ height: '10px', background: '#EEEDF5', borderRadius: '5px', marginBottom: '12px', width: `${70 + i * 5}%` }} />)}
              </div>
            </div>
          </div>
        ) : (
        <>
        {/* Row 1: KPI Cards Strip */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch', marginBottom: '20px' }}>

          {/* Card 1: OMTM - Qualified Reach */}
          <div style={{ width: '340px', flexShrink: 0, background: 'linear-gradient(180deg, #FFFFFF 0%, #F9F8FF 100%)', borderRadius: '18px', border: '2px solid rgba(124, 92, 252, 0.15)', boxShadow: '0 2px 8px rgba(124, 92, 252, 0.12), 0 8px 32px rgba(124, 92, 252, 0.08)', padding: '24px 24px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #7C5CFC 0%, #A78BFA 50%, #7C5CFC 100%)' }} />
            <div style={{ marginTop: '4px', marginBottom: '10px' }}>
              <span style={{ display: 'inline-block', background: 'linear-gradient(90deg, #7C5CFC 0%, #A78BFA 100%)', color: '#FFFFFF', fontSize: '8px', fontWeight: 700, letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '4px' }}>OMTM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', color: '#8B8FA3' }}>QUALIFIED REACH (QR)</span>
              <Info size={13} style={{ color: '#C8CBD9' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
              <svg width="200" height="115" viewBox="0 0 200 115">
                <defs>
                  <linearGradient id="qrGaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C5CFC" />
                    <stop offset="100%" stopColor="#A78BFA" />
                  </linearGradient>
                  <filter id="qrGlow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                  </filter>
                </defs>
                {/* Background arc */}
                <path d="M 15 100 A 85 85 0 0 1 185 100" fill="none" stroke="#EEEDF5" strokeWidth="12" strokeLinecap="round" />
                {/* Progress arc */}
                <path
                  d="M 15 100 A 85 85 0 0 1 185 100"
                  fill="none"
                  stroke="url(#qrGaugeGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(qrPercent / 100) * Math.PI * 85} ${Math.PI * 85}`}
                  filter="url(#qrGlow)"
                />
                {/* End marker */}
                <circle cx="185" cy="100" r="4" fill="none" stroke="#C8CBD9" strokeWidth="1.5" strokeDasharray="2 2" />
                <text x="100" y="76" textAnchor="middle" style={{ fontSize: '30px', fontWeight: 700, fill: '#1A1D2E', letterSpacing: '-0.02em' }}>{qrValue}</text>
                <text x="100" y="97" textAnchor="middle">
                  <tspan style={{ fontSize: '12px', fill: '#8B8FA3' }}>of </tspan>
                  <tspan style={{ fontSize: '14px', fontWeight: 700, fill: '#1A1D2E' }}>1M</tspan>
                </text>
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {qrDelta && <span style={{ background: '#E8FAF0', color: '#2DB77B', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '14px' }}>{qrDelta}</span>}
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C5CFC' }}>Reached: {qrPercent}%</span>
            </div>
          </div>

          {/* Card 2: Cost per QR (CpQR) */}
          <div style={{ flex: '1 1 0', minWidth: '160px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)', padding: '24px 20px 20px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7C5CFC 0%, #A78BFA 100%)' }} />
            <div style={{ height: '44px', display: 'flex', alignItems: 'start', paddingTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', color: '#8B8FA3' }}>COST PER QR (CpQR)</span>
                <Info size={13} style={{ color: '#C8CBD9' }} />
              </div>
            </div>
            <div style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#1A1D2E' }}>{cpqrValue}</span>
              {cpqrIsBelow
                ? <ArrowDown size={18} style={{ color: '#2DB77B' }} />
                : <ArrowUp size={18} style={{ color: '#E5484D' }} />
              }
            </div>
            <div style={{ height: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'start', paddingTop: '4px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#A0A4B8' }}>target </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1D2E' }}>{cpqrTargetVal}</span>
              </div>
            </div>
            <div style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {cpqrDelta && <span style={{ background: cpqrIsBelow ? '#E8FAF0' : '#FDEDF0', color: cpqrIsBelow ? '#2DB77B' : '#E5484D', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '14px' }}>{cpqrDelta}</span>}
            </div>
          </div>

          {/* Card 3: Qualified Reach Rate (QRR) */}
          <div style={{ flex: '1 1 0', minWidth: '160px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)', padding: '24px 20px 20px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7C5CFC 0%, #A78BFA 100%)' }} />
            <div style={{ height: '44px', display: 'flex', alignItems: 'start', paddingTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', color: '#8B8FA3' }}>QUALIFIED REACH RATE (QRR)</span>
                <Info size={13} style={{ color: '#C8CBD9' }} />
              </div>
            </div>
            <div style={{ height: '52px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#1A1D2E' }}>{qrrPercent}%</div>
              <div style={{ fontSize: '11px', color: '#A0A4B8' }}>qualified reach</div>
            </div>
            <div style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'start', paddingTop: '4px' }}>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <div style={{ display: 'flex', gap: '3px' }}>
                  {[
                    { color: '#E5484D', threshold: 20 },
                    { color: '#F59E0B', threshold: 40 },
                    { color: '#EAB308', threshold: 60 },
                    { color: '#22C55E', threshold: 80 },
                    { color: '#10B981', threshold: 100 },
                  ].map((seg, i) => (
                    <div key={i} style={{ flex: 1, height: '8px', background: seg.color, opacity: qrrPercent >= seg.threshold ? 1 : 0.25, borderRadius: i === 0 ? '4px 0 0 4px' : i === 4 ? '0 4px 4px 0' : '0' }} />
                  ))}
                </div>
                <div style={{ position: 'absolute', left: `${qrrPercent}%`, top: '8px', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '6px solid #1A1D2E' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#C8CBD9' }}>
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>
            <div style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {qrrDelta && <span style={{ background: '#E8FAF0', color: '#2DB77B', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '14px' }}>{qrrDelta}</span>}
            </div>
          </div>

          {/* Card 4: Audience Penetration Rate (APR) */}
          <div style={{ flex: '1 1 0', minWidth: '160px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)', padding: '24px 20px 20px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7C5CFC 0%, #A78BFA 100%)' }} />
            <div style={{ height: '44px', display: 'flex', alignItems: 'start', paddingTop: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', color: '#8B8FA3' }}>AUDIENCE PENETRATION (APR)</span>
                <Info size={13} style={{ color: '#C8CBD9' }} />
              </div>
            </div>
            <div style={{ height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#1A1D2E' }}>{aprValue}</span>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#A0A4B8' }}>penetration</span>
            </div>
            <div style={{ height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'start', gap: '6px', paddingTop: '4px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1A1D2E' }}>252K</span>
                <span style={{ fontSize: '11px', color: '#A0A4B8' }}> of </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1A1D2E' }}>1.4M</span>
                <span style={{ fontSize: '11px', color: '#A0A4B8' }}> ICP</span>
              </div>
              <div>
                <div style={{ position: 'relative', height: '8px', background: '#EEEDF5', borderRadius: '5px', overflow: 'hidden', marginBottom: '4px' }}>
                  <div style={{ width: `${aprPercent}%`, height: '100%', background: 'linear-gradient(90deg, #7C5CFC 0%, #A78BFA 100%)', borderRadius: '5px', boxShadow: '0 0 8px rgba(124, 92, 252, 0.2)' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px' }}>
                  <span style={{ color: '#7C5CFC', fontWeight: 600 }}>Reached 252K</span>
                  <span style={{ color: '#C8CBD9' }}>Untapped 1.1M</span>
                </div>
              </div>
            </div>
            <div style={{ height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {aprDelta && <span style={{ background: '#E8FAF0', color: '#2DB77B', fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '14px' }}>{aprDelta}</span>}
            </div>
          </div>
        </div>

        {/* Row 2: Budget Efficiency + Takeaways */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', marginBottom: '32px' }}>

          {/* Budget Efficiency Card */}
          <div style={{ background: 'linear-gradient(180deg, #F4F3FA 0%, #EEEDF5 100%)', borderRadius: '18px', border: '1px solid rgba(124, 92, 252, 0.08)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)', padding: '24px 24px 22px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #93A3D1 0%, #B8C4E0 100%)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em', color: '#8B8FA3' }}>BUDGET EFFICIENCY</span>
              <Info size={13} style={{ color: '#C8CBD9' }} />
            </div>
            {/* ROAS Sub-panel */}
            <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '12px', padding: '16px 18px', marginBottom: '12px' }}>
              <div style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#A0A4B8', marginBottom: '8px' }}>ROAS</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontSize: '28px', fontWeight: 700, color: '#1A1D2E' }}>3.2x</span>
                  <span style={{ fontSize: '12px', color: '#A0A4B8' }}> / </span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#6B6F85' }}>3.5x</span>
                  <span style={{ fontSize: '12px', color: '#A0A4B8' }}> target</span>
                </div>
                <div style={{ color: '#F59E0B' }}>
                  <AlertTriangle size={20} />
                </div>
              </div>
            </div>
            {/* SPEND Sub-panel */}
            <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '12px', padding: '16px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
                <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em', color: '#A0A4B8' }}>SPEND</span>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1A1D2E' }}>$142K</span>
                  <span style={{ fontSize: '12px', color: '#6B6F85' }}> / $500K</span>
                </div>
              </div>
              <div style={{ height: '8px', background: '#E4E3ED', borderRadius: '5px', overflow: 'hidden', marginBottom: '4px' }}>
                <div style={{ width: '28%', height: '100%', background: 'linear-gradient(90deg, #7C5CFC 0%, #A78BFA 100%)', borderRadius: '5px' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                <span style={{ color: '#7C5CFC', fontWeight: 600 }}>28% spent</span>
                <span style={{ color: '#A0A4B8' }}>72% remaining</span>
              </div>
            </div>
          </div>

          {/* Takeaways Card: Key Campaign Insights + Top 3 Opportunities */}
          <div style={{ background: '#FFFFFF', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.04)', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.05)', padding: '24px 28px 20px', position: 'relative', overflow: 'hidden', display: 'flex', gap: '40px' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7C5CFC 0%, #A78BFA 100%)' }} />
            {/* Key Campaign Insights */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1D2E', marginBottom: '14px', marginTop: 0 }}>Key Campaign Insights</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {insights.map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                    <div style={{ width: '6px', height: '6px', background: '#7C5CFC', marginTop: '6px', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#4A4D5E', lineHeight: '1.4' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Divider */}
            <div style={{ width: '1px', background: '#EEEDF5', alignSelf: 'stretch' }} />
            {/* Top 3 Opportunities */}
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1A1D2E', marginBottom: '14px', marginTop: 0 }}>Top 3 Opportunities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {opportunities.map((text, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'start' }}>
                    <div style={{ width: '6px', height: '6px', background: '#7C5CFC', marginTop: '6px', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: '#4A4D5E', lineHeight: '1.4' }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </>
        )}

        {/* The REACT Framework Header */}
        <div className="mb-8 relative">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-4xl font-semibold text-slate-900 tracking-tight flex items-baseline gap-2.5">
              The
              <span className="inline-flex items-center gap-1.5 mx-1 relative">
                {/* Subtle glow behind letters */}
                <div className="absolute inset-0 bg-purple-500/5 blur-2xl rounded-full" />
                <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-800 font-semibold text-3xl tracking-tight hover:border-purple-300/50 hover:shadow-md transition-all duration-300">R</span>
                <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-800 font-semibold text-3xl tracking-tight hover:border-purple-300/50 hover:shadow-md transition-all duration-300">E</span>
                <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-800 font-semibold text-3xl tracking-tight hover:border-purple-300/50 hover:shadow-md transition-all duration-300">A</span>
                <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-800 font-semibold text-3xl tracking-tight hover:border-purple-300/50 hover:shadow-md transition-all duration-300">C</span>
                <span className="relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-sm text-slate-800 font-semibold text-3xl tracking-tight hover:border-purple-300/50 hover:shadow-md transition-all duration-300">T</span>
              </span>
              Framework
            </h2>
            <p className="text-slate-500 text-base mt-3 font-medium">The marketing intelligence system that connects every customer touchpoint</p>
          </div>
        </div>

        <div className="space-y-4">
          {phasesData.map((phase) => (
            <PhaseCard
              key={phase.name}
              {...phase}
              reachFilterContext={phase.name === 'Reach' ? {
                selectedCampaigns,
                selectedPeriod,
                customRange,
              } : undefined}
              phaseExpandedData={phaseDetailMap[phase.name]?.data}
              phaseExpandedLoading={phaseDetailMap[phase.name]?.isLoading}
              onExpandedChange={(expanded) => {
                setExpandedPhases(prev => ({ ...prev, [phase.name]: expanded }));
              }}
            />
          ))}
        </div>

        {/* AgentIQ Banner */}
        <div className="relative bg-gradient-to-br from-white/90 via-purple-50/70 to-violet-50/60 backdrop-blur-xl rounded-2xl shadow-[0_2px_20px_rgba(139,92,246,0.15)] border border-purple-200/60 overflow-hidden mt-8">
          {/* Decorative background elements */}
          <div className="absolute top-8 right-12 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute top-16 right-32 w-16 h-16 bg-blue-500/30 rounded-full blur-2xl" />
          <div className="absolute top-4 right-20 w-8 h-8 bg-blue-600/25 rounded-full blur-xl" />
          <div className="absolute top-24 right-8 w-12 h-12 bg-violet-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-12 right-16 w-10 h-10 bg-blue-300/15 rounded-full blur-xl" />

          <div className="relative z-10 p-8">
            <div className="flex items-start justify-between">
              {/* Left Content */}
              <div className="flex items-start gap-5 flex-1">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>

                {/* Text Content */}
                <div className="flex-1">
                  <h2 className="text-slate-900 text-xl sm:text-2xl font-semibold mb-3 tracking-tight">
                    AgentIQ: Your Performance Co-Pilot
                  </h2>

                  {/* Mobile Badge - Below heading */}
                  <div className="flex lg:hidden mb-4">
                    <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-200/60 shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-sm font-medium text-slate-700">Ready to activate</span>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 max-w-2xl">
                    Get proactive insights, alerts, and recommendations powered by your campaign data.
                  </p>

                  {/* CTA Button */}
                  <button
                    className="px-6 py-3 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 font-semibold flex items-center gap-2 group"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Optimize with AgentIQ
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Small text */}
                  <p className="text-slate-500 text-xs mt-4">
                    Takes less than 2 minutes to activate personalized intelligence.
                  </p>
                </div>
              </div>

              {/* Right Badge - Desktop only */}
              <div className="hidden lg:flex flex-shrink-0 ml-6">
                <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-xl border border-emerald-200/60 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-medium text-slate-700">Ready to activate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
