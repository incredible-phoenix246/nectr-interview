import { cn } from '~/lib/utils'
import { Bell } from 'lucide-react'
import { Button } from '~/components/ui/button'

export const Notifications = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean
  setIsCollapsed: (isCollapsed: boolean) => void
}) => {
  return (
    <div
      className={cn(
        'bg-muted border-border flex cursor-pointer items-center justify-between gap-10 border p-2 transition-all duration-300',
        isCollapsed && 'p-0'
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          className="flex size-10 transition-all duration-300"
          size="icon"
          variant="ghost"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Bell />
        </Button>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm">Notifications</span>
          </div>
        )}
      </div>
    </div>
  )
}
