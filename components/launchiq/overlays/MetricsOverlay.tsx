"use client";

import { useEffect, useMemo, useState } from "react";
import {
  defaultOverlayMetricHints,
  LAUNCHIQ_V7_DEFAULT_AGE_RANGES,
  LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS,
  LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS,
  metricAffixForLabel,
  sanitizeMetricRawTyping,
  stripMetricRawValue,
} from "@/lib/launchiq-metrics";
import { goalNameToVisualKey } from "@/components/launchiq/lib/goalColors";

export type MetricsOverlayValues = {
  omtmValue: string;
  kpiValues: [string, string, string];
  revenueTarget: string;
  businessModel: string;
  businessType: string;
  industry: string;
  targetMarket: string;
  icp: string;
  competitors: string;
  ageRanges: string[];
  companySize: string;
  seniority: string;
  jobFunctions: string;
  demographicsGeography: string;
  interestsTags: string[];
  painTags: string[];
  motivations: string[];
};

const AGE_OPTIONS = ["18–24", "25–34", "35–44", "45–54", "55–64", "65+"];

const MOTIVATIONS = [
  "ROI clarity",
  "Time savings",
  "Competitive edge",
  "Team alignment",
  "Risk reduction",
] as const;

const MAX_INTERESTS = 5;
const MAX_PAINS = 3;

function OvMetricInputRow({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (raw: string) => void;
}) {
  const { prefix, suffix } = metricAffixForLabel(label);
  return (
    <div className="launchiq-ov-mrow">
      <div className="min-w-0 flex-1">
        <div className="launchiq-ov-mrow-label">{label}</div>
        <div className="launchiq-ov-mrow-hint">{hint}</div>
      </div>
      <div className="launchiq-ov-mrow-input-wrap">
        {prefix ? (
          <span className="launchiq-ov-mrow-pref" aria-hidden>
            {prefix}
          </span>
        ) : null}
        <input
          className="launchiq-ov-mrow-input"
          value={value}
          onChange={(e) => onChange(sanitizeMetricRawTyping(e.target.value))}
          placeholder="0"
          inputMode="decimal"
          aria-label={`${label} benchmark`}
        />
        {suffix ? (
          <span className="launchiq-ov-mrow-suf" aria-hidden>
            {suffix}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function OvLayer({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="launchiq-ov-layer">
      <button
        type="button"
        className="launchiq-ov-layer-head w-full text-left"
        data-open={open}
        onClick={onToggle}
      >
        <div className="launchiq-ov-layer-t">{title}</div>
        <div className="launchiq-ov-layer-arrow">▾</div>
      </button>
      <div className="launchiq-ov-layer-body" data-open={open}>
        {children}
      </div>
    </div>
  );
}

function normalizeInitial(
  partial: Partial<MetricsOverlayValues> | MetricsOverlayValues,
  labels: { omtm: string; kpis: [string, string, string] }
): MetricsOverlayValues {
  const k = partial.kpiValues;
  const kpis: [string, string, string] =
    Array.isArray(k) && k.length === 3
      ? [
          stripMetricRawValue(String(k[0]), labels.kpis[0]),
          stripMetricRawValue(String(k[1]), labels.kpis[1]),
          stripMetricRawValue(String(k[2]), labels.kpis[2]),
        ]
      : ["0", "0", "0"];
  return {
    omtmValue: stripMetricRawValue(partial.omtmValue != null ? String(partial.omtmValue) : "", labels.omtm),
    kpiValues: kpis,
    revenueTarget: partial.revenueTarget ?? "",
    ...LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS,
    ...LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS,
    ageRanges:
      partial.ageRanges && partial.ageRanges.length > 0
        ? [...partial.ageRanges]
        : [...LAUNCHIQ_V7_DEFAULT_AGE_RANGES],
    interestsTags: partial.interestsTags ?? [],
    painTags: partial.painTags ?? [],
    motivations: partial.motivations ?? [],
  };
}

export function MetricsOverlay({
  open,
  onOpenChange,
  goalLabel,
  kpiLabels: [k1, k2, k3],
  omtmLabel,
  initial,
  onApply,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  goalLabel: string;
  omtmLabel: string;
  kpiLabels: [string, string, string];
  initial: Partial<MetricsOverlayValues> | MetricsOverlayValues;
  onApply: (v: MetricsOverlayValues) => void;
}) {
  const labelBundle = useMemo(
    () => ({ omtm: omtmLabel, kpis: [k1, k2, k3] as [string, string, string] }),
    [omtmLabel, k1, k2, k3]
  );

  const [v, setV] = useState<MetricsOverlayValues>(() => normalizeInitial(initial, labelBundle));
  const [layerCtx, setLayerCtx] = useState(true);
  const [layerDemo, setLayerDemo] = useState(false);
  const [layerPsy, setLayerPsy] = useState(false);
  const [interestInput, setInterestInput] = useState("");
  const [painInput, setPainInput] = useState("");

  const goalKey = goalNameToVisualKey(goalLabel);
  const [h0, h1, h2, h3] = defaultOverlayMetricHints(goalKey);

  useEffect(() => {
    if (open) {
      setV(normalizeInitial(initial, labelBundle));
      setLayerCtx(true);
      setLayerDemo(false);
      setLayerPsy(false);
      setInterestInput("");
      setPainInput("");
    }
  }, [open, initial, labelBundle]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const toggleAge = (a: string) => {
    setV((s) => ({
      ...s,
      ageRanges: s.ageRanges.includes(a) ? s.ageRanges.filter((x) => x !== a) : [...s.ageRanges, a],
    }));
  };

  const toggleMotivation = (m: string) => {
    setV((s) => ({
      ...s,
      motivations: s.motivations.includes(m) ? s.motivations.filter((x) => x !== m) : [...s.motivations, m],
    }));
  };

  const addInterestTag = () => {
    const t = interestInput.trim();
    if (!t || v.interestsTags.length >= MAX_INTERESTS) return;
    setV((s) => ({ ...s, interestsTags: [...s.interestsTags, t] }));
    setInterestInput("");
  };

  const addPainTag = () => {
    const t = painInput.trim();
    if (!t || v.painTags.length >= MAX_PAINS) return;
    setV((s) => ({ ...s, painTags: [...s.painTags, t] }));
    setPainInput("");
  };

  if (!open) return null;

  return (
    <div className="launchiq-ov-overlay" role="dialog" aria-modal="true" aria-labelledby="launchiq-ov-title">
      <div className="launchiq-ov-backdrop" onClick={() => onOpenChange(false)} aria-hidden="true" />
      <div className="launchiq-ov-panel">
        <button
          type="button"
          className="launchiq-ov-close"
          onClick={() => onOpenChange(false)}
          aria-label="Close"
        >
          ×
        </button>

        <h2 id="launchiq-ov-title" className="launchiq-ov-title">
          Edit Target Metrics
        </h2>
        <p className="launchiq-ov-sub">
          Adjust benchmarks for your <strong>{goalLabel}</strong> campaign.
        </p>

        <div>
          <OvMetricInputRow
            label={omtmLabel}
            hint={h0}
            value={v.omtmValue}
            onChange={(raw) => setV({ ...v, omtmValue: raw })}
          />
          {[
            [k1, h1, 0],
            [k2, h2, 1],
            [k3, h3, 2],
          ].map(([label, hint, i]) => (
            <OvMetricInputRow
              key={String(label)}
              label={String(label)}
              hint={String(hint)}
              value={v.kpiValues[i as 0 | 1 | 2]}
              onChange={(raw) => {
                const next: [string, string, string] = [...v.kpiValues] as [string, string, string];
                next[i as 0 | 1 | 2] = raw;
                setV({ ...v, kpiValues: next });
              }}
            />
          ))}
        </div>

        <OvLayer title="Business Context & Benchmarks" open={layerCtx} onToggle={() => setLayerCtx(!layerCtx)}>
          <div className="launchiq-ov-ctx-grid">
            <div>
              <div className="launchiq-ov-ctx-l">Business Model</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS.businessModel}</div>
            </div>
            <div>
              <div className="launchiq-ov-ctx-l">Industry</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS.industry}</div>
            </div>
            <div>
              <div className="launchiq-ov-ctx-l">Business Type</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS.businessType}</div>
            </div>
            <div>
              <div className="launchiq-ov-ctx-l">Target Market</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS.targetMarket}</div>
            </div>
            <div>
              <div className="launchiq-ov-ctx-l">ICP</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS.icp}</div>
            </div>
            <div>
              <div className="launchiq-ov-ctx-l">Competitors</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS.competitors}</div>
            </div>
          </div>
        </OvLayer>

        <OvLayer title="Audience Demographics" open={layerDemo} onToggle={() => setLayerDemo(!layerDemo)}>
          <div className="mb-3.5">
            <div className="launchiq-ov-ctx-l">Age Ranges</div>
            <div className="launchiq-ov-chip-row">
              {AGE_OPTIONS.map((a) => (
                <button
                  key={a}
                  type="button"
                  className="launchiq-ov-chip"
                  data-on={v.ageRanges.includes(a)}
                  onClick={() => toggleAge(a)}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div className="launchiq-ov-ctx-grid">
            <div>
              <div className="launchiq-ov-ctx-l">Company Size</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS.companySize}</div>
            </div>
            <div>
              <div className="launchiq-ov-ctx-l">Seniority</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS.seniority}</div>
            </div>
            <div>
              <div className="launchiq-ov-ctx-l">Job Functions</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS.jobFunctions}</div>
            </div>
            <div>
              <div className="launchiq-ov-ctx-l">Geography</div>
              <div className="launchiq-ov-ctx-v">{LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS.demographicsGeography}</div>
            </div>
          </div>
          <div className="launchiq-ov-nudge">
            <div className="launchiq-ov-nudge-icon" aria-hidden>
              ✦
            </div>{" "}
            Demographics help AgentIQ personalize channel and creative recommendations for your audience.
          </div>
        </OvLayer>

        <OvLayer title="Psychographics & Interests" open={layerPsy} onToggle={() => setLayerPsy(!layerPsy)}>
          <div className="mb-3.5">
            <div className="launchiq-ov-ctx-l">
              Interests & Topics{" "}
              <span className="normal-case tracking-normal font-light">(max {MAX_INTERESTS})</span>
            </div>
            <div className="launchiq-ov-tag-input">
              {v.interestsTags.map((t) => (
                <span key={t} className="launchiq-ov-tag-pill">
                  {t}{" "}
                  <button
                    type="button"
                    onClick={() => setV({ ...v, interestsTags: v.interestsTags.filter((x) => x !== t) })}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInterestTag();
                  }
                }}
                placeholder="Add interest…"
              />
            </div>
          </div>
          <div className="mb-3.5">
            <div className="launchiq-ov-ctx-l">
              Pain Points{" "}
              <span className="normal-case tracking-normal font-light">(max {MAX_PAINS})</span>
            </div>
            <div className="launchiq-ov-tag-input">
              {v.painTags.map((t) => (
                <span key={t} className="launchiq-ov-tag-pill">
                  {t}{" "}
                  <button
                    type="button"
                    onClick={() => setV({ ...v, painTags: v.painTags.filter((x) => x !== t) })}
                  >
                    ×
                  </button>
                </span>
              ))}
              <input
                value={painInput}
                onChange={(e) => setPainInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPainTag();
                  }
                }}
                placeholder="Add pain point…"
              />
            </div>
          </div>
          <div>
            <div className="launchiq-ov-ctx-l">Buying Motivations</div>
            <div className="launchiq-ov-chip-row">
              {MOTIVATIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  className="launchiq-ov-chip"
                  data-on={v.motivations.includes(m)}
                  onClick={() => toggleMotivation(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="launchiq-ov-nudge">
            <div className="launchiq-ov-nudge-icon" aria-hidden>
              ✦
            </div>{" "}
            Psychographics power AgentIQ&apos;s messaging recommendations and content strategy suggestions.
          </div>
        </OvLayer>

        <div className="launchiq-ov-actions">
          <button type="button" className="launchiq-ov-btn-s" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            type="button"
            className="launchiq-ov-btn-p"
            onClick={() => {
              onApply({
                ...v,
                ...LAUNCHIQ_V7_OVERLAY_BUSINESS_FIELDS,
                ...LAUNCHIQ_V7_OVERLAY_DEMOGRAPHICS_FIELDS,
              });
              onOpenChange(false);
            }}
          >
            Apply changes
          </button>
        </div>
      </div>
    </div>
  );
}
