/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy API calls to the Express server (rewrite only applies in Next's dev server)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_URL ?? "http://localhost:3000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
