/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (
    config, options
  ) => {
    //config.module.noParse = [require.resolve("typescript/lib/typescript.js")]
    //config.externals = 'coffee-script';
    return config
  },
}

module.exports = nextConfig
