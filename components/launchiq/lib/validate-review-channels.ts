/** Count selected campaigns for one platform (keys are `${channelId}_${adAccountId}`). */
export function countSelectedCampaignsForChannel(
  channelId: string,
  selectedCampaigns: Record<string, Array<{ id: string; name: string }>>
): number {
  let total = 0;
  const prefix = `${channelId}_`;
  for (const [key, arr] of Object.entries(selectedCampaigns)) {
    if (!key.startsWith(prefix)) continue;
    total += Array.isArray(arr) ? arr.length : 0;
  }
  return total;
}

export type ReviewChannelForValidation = {
  platformId: string;
  title: string;
};

/** When there are connected channels, at least one must be included (checkbox on). */
export function validateAtLeastOneConnectedChannelIncluded(
  connectedChannels: ReadonlyArray<ReviewChannelForValidation>,
  includedChannelIds: Set<string>
): string | null {
  if (connectedChannels.length === 0) return null;
  const anyIncluded = connectedChannels.some((c) => includedChannelIds.has(c.platformId));
  if (!anyIncluded) {
    return "Select at least one connected channel to include in this campaign (use the checkbox on each channel).";
  }
  return null;
}

/**
 * For every included connected channel, require at least one selected campaign
 * (across all ad accounts under that channel).
 */
export function validateCampaignSelectionForIncludedChannels(
  connectedChannels: ReadonlyArray<ReviewChannelForValidation>,
  includedChannelIds: Set<string>,
  selectedCampaigns: Record<string, Array<{ id: string; name: string }>>
): string | null {
  const includedRows = connectedChannels.filter((c) => includedChannelIds.has(c.platformId));
  for (const ch of includedRows) {
    const n = countSelectedCampaignsForChannel(ch.platformId, selectedCampaigns);
    if (n < 1) {
      return `Select at least one campaign for ${ch.title}. Expand the channel and check at least one campaign.`;
    }
  }
  return null;
}
