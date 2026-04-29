"use client";

import Image from "next/image";
import {
  Facebook,
  Ghost,
  Instagram,
  Linkedin,
  Youtube,
  Radio,
  Mail,
  Search,
} from "lucide-react";

/** API may return a string URL or a logo object with `url`. */
export function resolveChannelLogoUrl(logo: unknown): string | null {
  if (logo == null) return null;
  if (typeof logo === "string") {
    const t = logo.trim();
    return t || null;
  }
  if (typeof logo === "object" && logo !== null && "url" in logo) {
    const u = (logo as { url?: unknown }).url;
    if (typeof u === "string") {
      const t = u.trim();
      return t || null;
    }
  }
  return null;
}

function isHttpUrl(s: string | null | undefined): s is string {
  if (s == null || typeof s !== "string") return false;
  const t = s.trim();
  return t.length > 0 && /^https?:\/\//i.test(t);
}

/** Brand-style glyph from channel id + name (aligned with InsightsIQ ReachExpandedContent). */
export function ReachChannelGlyph({
  id,
  name,
  className = "w-5 h-5",
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const c = `${id} ${name}`.toLowerCase();

  if (c.includes("facebook")) return <Facebook className={`${className} flex-shrink-0 text-[#1877F2]`} aria-hidden />;
  if (c.includes("instagram")) return <Instagram className={`${className} flex-shrink-0 text-[#E4405F]`} aria-hidden />;
  if (c.includes("linkedin")) return <Linkedin className={`${className} flex-shrink-0 text-[#0A66C2]`} aria-hidden />;
  if (c.includes("youtube")) return <Youtube className={`${className} flex-shrink-0 text-[#FF0000]`} aria-hidden />;
  if (c.includes("email")) return <Mail className={`${className} flex-shrink-0 text-[#6366F1]`} aria-hidden />;
  if (c.includes("organic") && (c.includes("search") || c.includes("google")))
    return <Search className={`${className} flex-shrink-0 text-[#34A853]`} aria-hidden />;
  if (c.includes("tiktok"))
    return (
      <svg className={`${className} flex-shrink-0 text-[#010101]`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
      </svg>
    );
  if (
    c.includes("google") ||
    c.includes("gdn") ||
    c.includes("ppc") ||
    c.includes("shopping") ||
    c.includes("dv360") ||
    c.includes("display")
  )
    return (
      <svg className={`${className} flex-shrink-0 text-[#4285F4]`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
    );
  if (c.includes("pinterest"))
    return (
      <svg className={`${className} flex-shrink-0 text-[#E60023]`} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.219-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.862-5.008-4.862-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
      </svg>
    );
  if (c.includes("snapchat")) return <Ghost className={`${className} flex-shrink-0 text-[#F7D731]`} aria-hidden />;

  return <Radio className={`${className} flex-shrink-0 text-slate-400`} aria-hidden />;
}

/**
 * Same tray treatment as /channels: light rounded square + logo image or brand glyph.
 */
export function ReachChannelTray({
  logoUrl,
  id,
  name,
  pixelSize = 36,
}: {
  /** String URL or API logo object `{ url: string }`. */
  logoUrl?: unknown;
  id: string;
  name: string;
  /** Outer box width/height (channels page uses 56px; here ~36px for dense tables). */
  pixelSize?: number;
}) {
  const imgPx = Math.max(20, Math.round(pixelSize * 0.62));
  const resolvedUrl = resolveChannelLogoUrl(logoUrl);

  return (
    <div
      className="relative flex flex-shrink-0 items-center justify-center rounded-2xl bg-gray-50 p-1.5"
      style={{ width: pixelSize, height: pixelSize }}
    >
      {isHttpUrl(resolvedUrl) ? (
        <Image
          src={resolvedUrl}
          alt={`${name} logo`}
          width={imgPx}
          height={imgPx}
          className="object-contain"
        />
      ) : (
        <ReachChannelGlyph id={id} name={name} className="h-[1.15rem] w-[1.15rem]" />
      )}
    </div>
  );
}
