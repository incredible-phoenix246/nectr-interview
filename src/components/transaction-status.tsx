import { AlertCircle, CheckCircle, Clock, ExternalLink } from 'lucide-react'

interface TransactionStatusProps {
  status: 'pending' | 'confirming' | 'success' | 'error'
  message?: string
  hash?: string
  onDismiss?: () => void
}

export function TransactionStatus({
  status,
  message,
  hash,
  onDismiss,
}: TransactionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="h-4 w-4 animate-pulse" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/10 border-yellow-400/30',
          title: 'Transaction Pending',
        }
      case 'confirming':
        return {
          icon: <Clock className="h-4 w-4 animate-spin" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/10 border-blue-400/30',
          title: 'Confirming Transaction',
        }
      case 'success':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'text-green-400',
          bgColor: 'bg-green-400/10 border-green-400/30',
          title: 'Transaction Successful',
        }
      case 'error':
        return {
          icon: <AlertCircle className="h-4 w-4" />,
          color: 'text-red-400',
          bgColor: 'bg-red-400/10 border-red-400/30',
          title: 'Transaction Failed',
        }
    }
  }

  const config = getStatusConfig()

  return (
    <div className={`rounded-lg border p-4 ${config.bgColor}`}>
      <div className="flex items-start gap-3">
        <div className={config.color}>{config.icon}</div>
        <div className="flex-1">
          <h4 className={`font-medium ${config.color}`}>{config.title}</h4>
          {message && <p className="mt-1 text-sm text-gray-300">{message}</p>}
          {hash && (
            <a
              href={`https://amoy.polygonscan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
            >
              View on PolygonScan <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
