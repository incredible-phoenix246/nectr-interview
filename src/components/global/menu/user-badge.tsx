import { cn } from '~/lib/utils'
import { useAccount } from 'wagmi'
import { Settings2 } from 'lucide-react'
import { thumbs } from '@dicebear/collection'
import { Button } from '~/components/ui/button'
import { createAvatar } from '@dicebear/core'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export const UserBadge = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
}) => {
  const { address } = useAccount()

  const avatar = createAvatar(thumbs, {
    scale: 50,
    flip: true,
    seed: address,
  }).toDataUri()
  return (
    <div
      className={cn(
        'bg-muted border-border flex cursor-pointer items-start justify-between gap-10 border p-4 transition-all duration-300',
        isCollapsed && 'p-0'
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex size-8 items-center justify-center"
        >
          <AvatarImage src={avatar} />
          <AvatarFallback>{address?.slice(0, 2)}</AvatarFallback>
        </Avatar>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm">tap to edit</span>
            <span className="text-sm">{address?.slice(0, 16)}...</span>
          </div>
        )}
      </div>
      {!isCollapsed && (
        <Button
          size="icon"
          className={cn('flex size-10 border transition-all duration-300')}
        >
          <Settings2 />
        </Button>
      )}
    </div>
  )
}
