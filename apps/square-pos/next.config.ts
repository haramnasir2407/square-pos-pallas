// import MillionLint from "@million/lint";
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'items-images-sandbox.s3.us-west-2.amazonaws.com',
      },
    ],
  },
  experimental: {
    reactCompiler: true,
  },
  // logging: { // logs which endpoints are cached or not
  //   fetches: {
  //     fullUrl: true,
  //   },
  // },
}

export default nextConfig
// export default MillionLint.next({ rsc: true })(nextConfig);
