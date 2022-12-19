const { env } = require("./src/server/env");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false
};

module.exports = nextConfig;
