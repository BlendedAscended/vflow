import path from "path";
import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://js.stripe.com https://cdn.sanity.io https://*.sanity.io https://*.sanity-cdn.com https://vercel.live https://*.spline.design;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
    img-src 'self' blob: data: https://cdn.sanity.io https://*.sanity.io https://*.sanity-cdn.com https://*.stripe.com https://*.spline.design https://raw.githack.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self' https://*.sanity.io https://*.sanity.studio;
    frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
    connect-src 'self' blob: https://api.stripe.com https://maps.googleapis.com https://cdn.sanity.io https://*.sanity.io https://*.api.sanity.io https://*.apicdn.sanity.io https://api.bigdatacloud.net https://registry.npmjs.org https://api.github.com https://*.spline.design https://prod.spline.design https://raw.githack.com https://raw.githubusercontent.com;
`;

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
