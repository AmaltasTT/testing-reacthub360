/**
 * OAuth Configuration for Platform Integrations
 *
 * This file contains the configuration for OAuth providers and their associated platforms.
 * Each provider has an initialization endpoint and a list of platform slugs that use it.
 */

export interface OAuthProvider {
  name: string;
  initEndpoint: string;
  platforms: string[];
  requiresScope?: boolean; // Whether the API requires the 'scope' parameter (default: true)
}

export const OAUTH_PROVIDERS: Record<string, OAuthProvider> = {
  google: {
    name: 'Google',
    initEndpoint: 'https://xyfx-hog3-y19r.n7e.xano.io/api:JdHq--Hz/oauth/google/init',
    platforms: [
      'google_ads',
      'google_gdn',
      'google_analytics',
      'google_shopping',
      'google_search_console',
      'youtube_ads',
      'youtube_organic'
    ]
  },
  facebook: {
    name: 'Facebook/Meta',
    initEndpoint: 'https://xyfx-hog3-y19r.n7e.xano.io/api:uDMVvt5c/oauth/facebook/init',
    platforms: [
      'facebook_ads',
      'facebook_organic',
      'instagram_ads',
      'instagram_organic'
    ]
  },
  linkedin: {
    name: 'LinkedIn',
    initEndpoint: 'https://xyfx-hog3-y19r.n7e.xano.io/api:UlrKEiKf/oauth/linkedin/init',
    platforms: [
      'linkedin_members',
      'linkedin_ads'
    ],
    requiresScope: false // LinkedIn API doesn't require the scope parameter
  },
  microsoft: {
    name: 'Microsoft',
    initEndpoint: 'https://xyfx-hog3-y19r.n7e.xano.io/api:73m4Ts93/oauth/microsoft/init',
    platforms: [
      'microsoft_search_ads',
      'yahoo_search_ads',
      'microsoft_audience_network',
      'microsoft_shopping_ads'
    ],
    requiresScope: false // Microsoft API doesn't require the scope parameter
  },
  pinterest: {
    name: 'Pinterest',
    initEndpoint: 'https://xyfx-hog3-y19r.n7e.xano.io/api:TFmH-rng/oauth/pinterest/init',
    platforms: [
      'pinterest_ads',
      'pinterest_organic'
    ],
    requiresScope: true // Pinterest API requires the scope parameter
  },
  mailchimp: {
    name: 'Mailchimp',
    initEndpoint: 'https://xyfx-hog3-y19r.n7e.xano.io/api:O4KlbC08/oauth/mailchimp/init',
    platforms: [
      'mailchimp'
    ],
    requiresScope: false // Mailchimp API doesn't require the scope parameter
  }
  // Add more providers here as needed
  // twitter: { ... },
  // tiktok: { ... },
  // etc.
};

/**
 * Get the OAuth provider for a given platform slug
 * @param platformSlug - The slug of the platform (e.g., 'google_ads', 'facebook_ads')
 * @returns The OAuth provider config or null if not found
 */
export function getOAuthProvider(platformSlug: string): OAuthProvider | null {
  for (const provider of Object.values(OAUTH_PROVIDERS)) {
    if (provider.platforms.includes(platformSlug)) {
      return provider;
    }
  }
  return null;
}

/**
 * Check if a platform supports OAuth
 * @param platformSlug - The slug of the platform
 * @returns True if the platform has OAuth support configured
 */
export function isOAuthSupported(platformSlug: string): boolean {
  return getOAuthProvider(platformSlug) !== null;
}

/**
 * Get the OAuth redirect URI from environment variables
 * @returns The redirect URI or a default value
 */
export function getOAuthRedirectUri(): string {
  return process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || 'https://reacthub360.webflow.io/app/auth-redirect';
}
