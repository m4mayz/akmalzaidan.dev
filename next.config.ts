import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
};

module.exports = {
    allowedDevOrigins: [
        "runtgenographically-preposterous-shanel.ngrok-free.dev",
    ],
};

export default nextConfig;
