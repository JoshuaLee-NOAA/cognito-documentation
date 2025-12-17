import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    form-action 'self' https://us-east-18kx012qnq.auth.us-east-1.amazoncognito.com https://sso.noaa.gov https://idp.int.identitysandbox.gov;
    upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
        ],
      },
    ]
  },
};

export default nextConfig;
