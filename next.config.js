/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.GITHUB_ACTIONS ? "/textlint-for-labs" : '',
}

module.exports = nextConfig
