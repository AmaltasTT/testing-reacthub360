"use client";

/**
 * Screen 3 — success state aligned with `data/LaunchIQ_v7.html` (#v3).
 */

export type LaunchChannelSummary = { name: string; count: string };

export function LaunchScreen({
  campaignName,
  goalLabel,
  regionsLabel,
  channelSummaries,
  omtmLabel,
  kpiSummary,
  costMetricLabel,
  initializing,
  onGoToInsightsIQ,
  onCreateAnother,
}: {
  campaignName: string;
  goalLabel: string;
  regionsLabel: string;
  channelSummaries: LaunchChannelSummary[];
  omtmLabel: string;
  kpiSummary: string;
  costMetricLabel: string;
  initializing: boolean;
  onGoToInsightsIQ: () => void;
  onCreateAnother: () => void;
}) {
  return (
    <div className="launchiq-screen-enter mx-auto max-w-[580px] px-6 pb-40 pt-[56px]">
      <div className="launchiq-suc-head">
        <div className="launchiq-suc-ring" aria-hidden>
          <svg viewBox="0 0 24 24">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </div>
        <h1 className="launchiq-suc-title">
          Campaign
          <br />
          is trackable.
        </h1>
        <p className="launchiq-suc-sub">Intelligence unlocked. Insights sharpen as data flows.</p>
      </div>

      <div className="launchiq-sum">
        <div className="launchiq-sum-nm">{campaignName}</div>
        <div className="launchiq-sum-pills">
          <span className="launchiq-sum-pill">{goalLabel}</span>
          <span className="launchiq-sum-pill launchiq-sum-pill--muted">{regionsLabel}</span>
        </div>
        <div className="launchiq-sum-chs">
          {channelSummaries.map((c, i) => {
            const isAll = /\ball\b/i.test(c.count);
            return (
              <span key={`${c.name}-${i}`} className="launchiq-sum-ch">
                {c.name}{" "}
                <strong className={isAll ? "launchiq-sum-ch-all" : undefined}>{c.count}</strong>
              </span>
            );
          })}
        </div>
        <div className="launchiq-smg">
          <div className="launchiq-smc">
            <div className="launchiq-smc-l">OMTM</div>
            <div className="launchiq-smc-v">{omtmLabel}</div>
          </div>
          <div className="launchiq-smc">
            <div className="launchiq-smc-l">KPIs</div>
            <div className="launchiq-smc-v">{kpiSummary}</div>
          </div>
          <div className="launchiq-smc">
            <div className="launchiq-smc-l">Cost</div>
            <div className="launchiq-smc-v">{costMetricLabel}</div>
          </div>
        </div>
        <div className="launchiq-init-status" role="status" aria-busy={initializing}>
          <span
            className={`launchiq-init-dot${initializing ? "" : " launchiq-init-dot--steady"}`}
            aria-hidden
          />
          Initializing metric pipeline — insights will appear shortly
        </div>
      </div>

      <div className="launchiq-suc-acts">
        <button type="button" className="launchiq-btn-insights" onClick={onGoToInsightsIQ}>
          Go to InsightsIQ
        </button>
        <button type="button" className="launchiq-btn-create-another" onClick={onCreateAnother}>
          Create another campaign
        </button>
      </div>
    </div>
  );
}
