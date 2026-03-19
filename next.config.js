/** @type {import('next').NextConfig} */

const nextConfig = {

  // Performance
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },

  webpack: (config, { dev, isServer }) => {

    if (!dev && !isServer) {

      config.optimization = {
        ...config.optimization,
        minimize: true,
        usedExports: true,
        sideEffects: false,
      }

      if (config.optimization.minimizer) {
        config.optimization.minimizer.forEach((plugin) => {
          if (plugin.constructor.name === 'TerserPlugin') {
            plugin.options.terserOptions = {
              ...plugin.options.terserOptions,
              compress: {
                ...plugin.options.terserOptions?.compress,
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
              },
            }
          }
        })
      }
    }

    return config
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'morx-team.vercel.app' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  async headers() {
    return [

      // Aggressive caching for quizzes
      {
        source: '/quizzes/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },

      // Images caching
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, s-maxage=604800, immutable',
          },
        ],
      },

      // Drive API caching
      {
        source: '/api/drive/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },

      // Google API caching
      {
        source: '/api/google-drive/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=1800, stale-while-revalidate=86400',
          },
        ],
      },

      // Drive pages caching
      {
        source: '/drive/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=600, stale-while-revalidate=3600',
          },
        ],
      },

      // Static pages caching
      {
        source: '/specialization/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },

      // 🔐 Global security headers (UPDATED for AdSense)
      {
        source: '/:path*',
        headers: [

          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },

          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",

              // ✅ Scripts (AdSense enabled)
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",

              // ✅ Styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

              // ✅ Fonts
              "font-src 'self' https://fonts.gstatic.com",

              // ✅ Images
              "img-src 'self' data: https: blob:",

              // ✅ Connections
              "connect-src 'self' https://*.supabase.co https://accounts.google.com https://www.googleapis.com https://docs.google.com https://pagead2.googlesyndication.com",

              // ✅ Frames (AdSense important)
              "frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://accounts.google.com https://www.youtube.com https://www.youtube-nocookie.com https://docs.google.com",

              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self' https://docs.google.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },

          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]
            : []),
        ],
      },
    ]
  },
}

export default nextConfig
