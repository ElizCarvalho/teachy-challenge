/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      NEXT_PUBLIC_ZITADEL_URL: process.env.NEXT_PUBLIC_ZITADEL_URL,
      NEXT_PUBLIC_ZITADEL_CLIENT_ID: process.env.NEXT_PUBLIC_ZITADEL_CLIENT_ID,
      NEXT_PUBLIC_ZITADEL_PROJECT_ID: process.env.NEXT_PUBLIC_ZITADEL_PROJECT_ID,
      ZITADEL_CLIENT_SECRET: process.env.ZITADEL_CLIENT_SECRET,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    output: 'standalone',
    transpilePackages: ['swagger-ui-react']
  }
  
  module.exports = nextConfig