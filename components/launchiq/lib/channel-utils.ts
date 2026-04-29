/** Handoff: use "Facebook Ads", "Instagram Ads" — never "Meta Ads". */
export function displayChannelName(slug: string, apiName: string): string {
  const s = slug.toLowerCase();
  if (s === "facebook_ads" || s === "facebook_organic") return "Facebook Ads";
  if (s === "instagram_ads" || s === "instagram_organic") return "Instagram Ads";
  return apiName;
}

export function isOrganicSlug(slug: string): boolean {
  return slug.toLowerCase().includes("organic");
}
