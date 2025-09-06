import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { inDevEnvironment } from '~/lib/utils'


const withNextIntl = createNextIntlPlugin()
const nextConfig: NextConfig = {
  typedRoutes: true,
  experimental: {
    typedEnv: true,
    browserDebugInfoInTerminal: inDevEnvironment
  },
  compiler: {
    removeConsole: !inDevEnvironment,
  },
}

export default withNextIntl(nextConfig)
