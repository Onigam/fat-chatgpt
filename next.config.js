/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  server: {
    // Increase the timeout limit to 30 seconds
    timeout: 30000,
  },
}

module.exports = nextConfig
