'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { UserBadge } from './user-badge'
import { Notifications } from './notifications'
import { Button } from '~/components/ui/button'
import { ConnectWallet } from './connect-wallet'
import { useDisconnect } from '@reown/appkit/react'
import { ChevronLeft, ChevronRight, LockOpen, Loader2 } from 'lucide-react'
import { ThemeSwitch } from '../theme-switch'

export const Menu = () => {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (!isConnected) {
    return <ConnectWallet />
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await disconnect()
    } catch (error) {
      console.error('Error during signout:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <div className="absolute bottom-5 left-5 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Button
          size="icon"
          className="flex size-10 items-center justify-center border transition-all duration-300"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        {!isCollapsed && (
          <>
            <ThemeSwitch />
            <Button
              size="icon"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="flex size-10 items-center justify-center transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSigningOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LockOpen />
              )}
            </Button>
          </>
        )}
      </div>
      <Notifications
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      <UserBadge isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </div>
  )
}
