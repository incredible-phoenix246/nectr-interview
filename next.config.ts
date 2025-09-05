import type { NextConfig } from 'next'
import { inDevEnvironment } from '~/lib/utils'

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
