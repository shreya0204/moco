import type { NextConfig } from "next";
import path from "node:path";

const config: NextConfig = {
  transpilePackages: ["@moco/registry"],
  devIndicators: false,
  webpack: (cfg) => {
    cfg.resolve.alias["@/components/moco/hooks"] = path.resolve(
      __dirname,
      "../../registry/hooks/hooks.ts",
    );
    return cfg;
  },
};

export default config;
