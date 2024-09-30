/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // By default, Next.js will run ESLint for all files in the pages/, app/, components/, lib/, and src/ directories
    dirs: ["ai", "app", "components", "drizzle", "utils"],
  },
  logging: {
    fetches: {
      fullUrl: true,
      // fetch requests that are restored from the Server Components HMR cache
      hmrRefreshes: true,
    },
  },
  pageExtensions: ["ts", "tsx"],
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
