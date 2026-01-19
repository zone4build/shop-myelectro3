const path = require('path');
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');
const { i18n } = require('./next-i18next.config');

console.log('>>> next.config.js loading...');
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  basePath: process.env.NODE_ENV === 'development' ? '/shop' : '',
  i18n,
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'googleusercontent.com' },
      { hostname: 'graph.facebook.com' },
      { hostname: 'res.cloudinary.com' },
      { hostname: 's3.amazonaws.com' },
      { hostname: '18.141.64.26' },
      { hostname: 'localhost' },
      { hostname: '127.0.0.1' },
      { hostname: 'pixarlaravel.s3.ap-southeast-1.amazonaws.com' },
      { hostname: 'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com' },
      { hostname: 'pickbazarlaravel.s3-ap-southeast-1.amazonaws.com' },
      { hostname: 's3.ap-southeast-1.amazonaws.com' },
      { hostname: 's3-ap-southeast-1.amazonaws.com' },
      { hostname: 'zone4food.s3.eu-west-3.amazonaws.com' },
      { hostname: 'admin.zone4food.com' },
      { hostname: 'zone4food.com' },
      { hostname: 'i.pravatar.cc' },
    ],
  },
  webpack(config, options) {
    config.resolve.alias['react'] = path.resolve(__dirname, 'node_modules', 'react');
    config.resolve.alias['react-dom'] = path.resolve(
      __dirname,
      'node_modules',
      'react-dom'
    );

    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      'node_modules',
    ];

    return config;
  },
  experimental: {
    // Disable ISR memory cache to force dynamic rendering
    // This prevents static generation errors with Jotai atoms
  },
  transpilePackages: [
    'jotai',
    'framer-motion',
    'swiper',
    'react-query',
    '@headlessui/react',
    'react-sticky-box',
    'rc-table',
    'rc-pagination',
    'rc-collapse',
    'rc-rate',
    'rc-slider',
    'react-datepicker',
    'react-toastify',
    'react-use',
    'react-dropzone',
    'react-hook-form',
    'react-phone-input-2',
    'react-otp-input',
    'react-copy-to-clipboard',
    'react-content-loader',
    'react-device-detect'
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};

// module.exports = withPWA(nextConfig);
module.exports = nextConfig;
