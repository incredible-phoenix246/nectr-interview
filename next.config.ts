import type { NextConfig } from 'next'
import { inDevEnvironment } from './src/lib/utils.js'

const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    typedEnv: true,
  },
  compiler: {
    removeConsole: !inDevEnvironment,
  },
}

export default nextConfig
