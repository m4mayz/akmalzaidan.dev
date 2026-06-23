import type { NextConfig } from "next";

const supabaseAssetHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["runtgenographically-preposterous-shanel.ngrok-free.dev"],
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
    qualities: [25, 50, 75, 100],
    remotePatterns: supabaseAssetHost
      ? [
          {
            protocol: "https",
            hostname: supabaseAssetHost,
            pathname: "/storage/v1/object/public/portfolio-assets/**",
          },
        ]
      : [],
  },
  output: "standalone",
};

export default nextConfig;
