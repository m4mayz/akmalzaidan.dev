import type { NextConfig } from "next";

const supabaseAssetHost = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
    : undefined;

const nextConfig: NextConfig = {
    allowedDevOrigins: [
        "runtgenographically-preposterous-shanel.ngrok-free.dev",
    ],
    images: {
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
