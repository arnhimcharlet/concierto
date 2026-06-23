"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Users, Clock, Bell, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { QueueState } from "@/lib/types"

interface Props {
  queueState: QueueState | null
  loading: boolean
  error: string | null
  onJoinQueue: () => void
  onEnterEvent: () => void
}

export function QueueWaitingRoom({ queueState, loading, error, onJoinQueue, onEnterEvent }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!queueState) return
    const total = queueState.total_in_queue
    const pos = queueState.position
    if (total > 0) {
      setProgress(Math.round(((total - pos) / total) * 100))
    }
  }, [queueState])

  if (!queueState && !error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Join the Waiting Room</h2>
          <p className="text-muted-foreground">
            The queue will open 10 minutes before the scheduled sale time. Click below to secure your spot.
          </p>
          <Button onClick={onJoinQueue} disabled={loading} size="lg" className="px-8">
            {loading ? "Joining..." : "Join Queue"}
          </Button>
          {error && (
            <p className="text-sm text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </p>
          )}
        </motion.div>
      </div>
    )
  }

  if (queueState?.status === "invited") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-green-500/10 flex items-center justify-center animate-queen-pulse">
            <Bell className="h-12 w-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold">It&apos;s Your Turn!</h2>
          <p className="text-muted-foreground text-lg">
            You now have 15 minutes to select your seats and complete your purchase.
          </p>
          <Button onClick={onEnterEvent} size="lg" className="px-10 text-lg">
            Enter Venue
          </Button>
        </motion.div>
      </div>
    )
  }

  if (queueState?.status === "entered") {
    return null
  }

  if (queueState?.status === "expired") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold">Session Expired</h2>
          <p className="text-muted-foreground">
            Your turn in the queue has expired. Please try again.
          </p>
          <Button onClick={onJoinQueue} variant="outline">Rejoin Queue</Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={queueState?.position}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-md w-full"
        >
          <div>
            <div className="text-7xl font-black text-primary mb-2">
              {queueState?.position.toLocaleString()}
            </div>
            <p className="text-muted-foreground">Your position in queue</p>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {queueState?.total_in_queue.toLocaleString()} people in queue ahead of you
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Est. wait {Math.min(queueState?.estimated_wait_seconds || 0, 999)}s</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>{queueState?.total_in_queue} total</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
            <p className="text-sm text-muted-foreground">
              Stay on this page. We&apos;ll notify you when it&apos;s your turn. Keep your tab open and don&apos;t refresh.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
