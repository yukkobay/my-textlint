/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.GITHUB_ACTIONS ? "/textlint-for-labs" : '',
}

module.exports = nextConfig
