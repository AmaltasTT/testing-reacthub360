"use client";

import type { CampaignGoal } from "@/hooks/use-campaign-goals";
import { GoalCard } from "@/components/launchiq/components/GoalCard";
import { DraftBanner } from "@/components/launchiq/components/DraftBanner";

export function DefineScreen({
  campaignName,
  onNameChange,
  goals,
  selectedGoalId,
  onSelectGoal,
  showDraftBanner,
  draftName,
  draftAgeLabel,
  onResumeDraft,
  onDiscardDraft,
  canContinue,
  onContinue,
  continuePending = false,
  draftBannerLoading = false,
  errorMessage = null,
}: {
  campaignName: string;
  onNameChange: (v: string) => void;
  goals: CampaignGoal[];
  selectedGoalId: string;
  onSelectGoal: (id: string) => void;
  showDraftBanner: boolean;
  draftName: string;
  draftAgeLabel: string;
  onResumeDraft: () => void;
  onDiscardDraft: () => void;
  canContinue: boolean;
  onContinue: () => void;
  /** True while POSTing the server draft before opening Review. */
  continuePending?: boolean;
  draftBannerLoading?: boolean;
  errorMessage?: string | null;
}) {
  return (
    <div className="launchiq-screen-enter mx-auto max-w-[580px] px-6 pb-40 pt-[100px]">
      {errorMessage ? (
        <div className="mb-5 rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-2.5 text-[13px] font-medium text-rose-600">
          {errorMessage}
        </div>
      ) : null}
      {showDraftBanner && (
        <DraftBanner
          campaignName={draftName}
          ageLabel={draftAgeLabel}
          onResume={onResumeDraft}
          onDiscard={onDiscardDraft}
          isBusy={draftBannerLoading}
        />
      )}
      <h1 className="mb-3.5 text-[48px] font-extrabold leading-[1.02] tracking-[-2px] text-[#1d1d1f]">
        What are we
        <br />
        building?
      </h1>
      <p className="mb-14 text-[17px] font-light leading-relaxed text-[#6e6e73]">
        Name it and pick a goal. Open Review setup to save a draft to your workspace.
      </p>

      <div className="mb-9">
        <label className="mb-2.5 block text-[13px] font-medium text-[#6e6e73]">Campaign name</label>
        <input
          className="w-full rounded-[14px] border border-white/45 bg-[rgba(255,255,255,0.8)] px-[22px] py-[18px] text-lg text-[#1d1d1f] outline-none backdrop-blur-md transition-all duration-300 [transition-timing-function:var(--launchiq-spring)] placeholder:font-light placeholder:text-[#aeaeb2] focus:border-[#6366F1] focus:shadow-[0_0_0_4px_rgba(99,102,241,0.08),0_8px_32px_rgba(99,102,241,0.06)]"
          placeholder="Q2 Brand Awareness — DACH"
          value={campaignName}
          onChange={(e) => onNameChange(e.target.value)}
        />
      </div>

      <div className="mb-9">
        <label className="mb-2.5 block text-[13px] font-medium text-[#6e6e73]">What&apos;s the goal?</label>
        <div className="grid grid-cols-2 gap-3.5">
          {goals.map((g) => (
            <GoalCard
              key={g.id}
              goalId={g.id}
              goalName={g.name}
              selected={selectedGoalId === g.id}
              onSelect={() => onSelectGoal(g.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-14">
        <button
          type="button"
          disabled={!canContinue || continuePending}
          onClick={onContinue}
          className="w-full rounded-[18px] bg-gradient-to-br from-[#6366F1] to-[#4F46E5] py-[18px] text-[17px] font-semibold text-white shadow-[0_6px_24px_rgba(99,102,241,0.2)] transition-all duration-300 [transition-timing-function:var(--launchiq-spring)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(99,102,241,0.25)] disabled:cursor-not-allowed disabled:opacity-15 disabled:hover:translate-y-0"
        >
          {continuePending ? "Saving…" : "Review setup"}
        </button>
      </div>
    </div>
  );
}
