/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Ensure Motion library works properly
  transpilePackages: ['motion'],

  // Configure image domains for next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lovable.dev',
      },
      {
        protocol: 'https',
        hostname: 'xyfx-hog3-y19r.n7e.xano.io',
      },
    ],
  },

  // Optional: Environment variables
  env: {
    // Add any public env vars here in future
  },
}

export default nextConfig
