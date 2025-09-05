/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { Twitter, MessageCircle, Users, ExternalLink } from 'lucide-react'

export function SocialFeed() {
  const [twitterLoaded, setTwitterLoaded] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).twttr?.widgets) {
      ;(window as any).twttr.widgets.load()
      setTwitterLoaded(true)
    }
  }, [])

  const handleTwitterLoad = () => {
    setTwitterLoaded(true)
    if (typeof window !== 'undefined' && (window as any).twttr?.widgets) {
      ;(window as any).twttr.widgets.load()
    }
  }

  return (
    <div className="bg-card border border-dashed p-6 backdrop-blur-md max-md:p-2">
      <h2 className="mb-6 flex items-center gap-2 text-2xl font-semibold text-white">
        <Users className="h-6 w-6" />
        Community Hub
      </h2>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Twitter */}
        <a
          href="https://twitter.com/NECTRProtocol"
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-4 transition-all duration-200 hover:from-blue-500/30 hover:to-blue-600/30"
        >
          <div className="flex items-center gap-3">
            <Twitter className="h-6 w-6 text-blue-400" />
            <div>
              <h3 className="font-medium text-white">Twitter</h3>
              <p className="text-sm text-blue-300">Follow updates</p>
            </div>
            <ExternalLink className="h-4 w-4 text-blue-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </a>

        {/* Telegram */}
        <a
          href="https://t.me/NECTRCommunity"
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 p-4 transition-all duration-200 hover:from-cyan-500/30 hover:to-cyan-600/30"
        >
          <div className="flex items-center gap-3">
            <MessageCircle className="h-6 w-6 text-cyan-400" />
            <div>
              <h3 className="font-medium text-white">Telegram</h3>
              <p className="text-sm text-cyan-300">Join chat</p>
            </div>
            <ExternalLink className="h-4 w-4 text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </a>

        {/* Discord */}
        <a
          href="https://discord.gg/NECTRCommunity"
          target="_blank"
          rel="noopener noreferrer"
          className="group border border-indigo-500/30 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 p-4 transition-all duration-200 hover:from-indigo-500/30 hover:to-indigo-600/30"
        >
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-indigo-400" />
            <div>
              <h3 className="font-medium text-white">Discord</h3>
              <p className="text-sm text-indigo-300">Community</p>
            </div>
            <ExternalLink className="h-4 w-4 text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </a>
      </div>

      {/* Twitter Feed */}
      <div className="bg-black/20 p-4">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-medium text-white">
          <Twitter className="h-5 w-5 text-blue-400" />
          Latest Updates
        </h3>

        <div className="twitter-embed-container">
          {!twitterLoaded && (
            <div className="flex h-64 items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
                <p>Loading Twitter feed...</p>
              </div>
            </div>
          )}

          <a
            className="twitter-timeline"
            data-height="400"
            data-theme="dark"
            data-chrome="nofooter noborders"
            href="https://twitter.com/ethereum?ref_src=twsrc%5Etfw"
          >
            Tweets by Ethereum
          </a>
        </div>
      </div>

      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={handleTwitterLoad}
      />
    </div>
  )
}
