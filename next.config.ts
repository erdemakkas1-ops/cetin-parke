import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cetin-parke",
  assetPrefix: "/cetin-parke/",
  images: { unoptimized: true },
  trailingSlash: true,
};
export default nextConfig;
