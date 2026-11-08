/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Paid source files live outside public/ and are served only by the
    // /api/download gate — make sure they are traced into that function.
    outputFileTracingIncludes: {
      '/api/download': ['./delivery-private/**/*'],
    },
  },
};

module.exports = nextConfig;
