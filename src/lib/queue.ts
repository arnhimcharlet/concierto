import { redis, QUEUE_KEY, QUEUE_STATUS_KEY, QUEUE_META_KEY, QUEUE_COUNTER_KEY } from "./redis"
import { QUEUE_OPEN_BEFORE_SECONDS } from "./constants"
import type { QueueState } from "./types"

export async function isQueueOpen(onSaleAt: string): Promise<boolean> {
  const saleTime = new Date(onSaleAt).getTime()
  const openTime = saleTime - QUEUE_OPEN_BEFORE_SECONDS * 1000
  return Date.now() >= openTime
}

export async function joinQueue(eventId: string, userId: string): Promise<{ position: number; totalInQueue: number }> {
  const existing = await redis.zscore(QUEUE_KEY(eventId), userId)
  if (existing !== null) {
    const rank = await redis.zrank(QUEUE_KEY(eventId), userId)
    const total = await redis.zcard(QUEUE_KEY(eventId))
    return { position: rank !== null ? rank + 1 : 1, totalInQueue: total }
  }

  const position = await redis.incr(QUEUE_COUNTER_KEY(eventId))
  await redis.zadd(QUEUE_KEY(eventId), { score: position, member: userId })
  await redis.hset(QUEUE_STATUS_KEY(eventId), { [userId]: "waiting" })
  const total = await redis.zcard(QUEUE_KEY(eventId))

  return { position, totalInQueue: total }
}

function normalizeStatus(raw: string): QueueState["status"] {
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === "object" && parsed.status) {
      return parsed.status as QueueState["status"]
    }
  } catch {
  }
  return raw as QueueState["status"]
}

export async function getQueuePosition(eventId: string, userId: string): Promise<QueueState | null> {
  const rank = await redis.zrank(QUEUE_KEY(eventId), userId)
  const total = await redis.zcard(QUEUE_KEY(eventId))
  const rawStatus = await redis.hget<string>(QUEUE_STATUS_KEY(eventId), userId)

  if (rank === null || !rawStatus) return null

  const meta = await redis.hgetall<{ current_serving?: string; is_open?: string }>(QUEUE_META_KEY(eventId))
  const currentServing = meta?.current_serving ? parseInt(meta.current_serving) : 0
  const positionsAhead = rank
  const estimatedWaitSeconds = positionsAhead * 2

  return {
    event_id: eventId,
    position: rank + 1,
    total_in_queue: total,
    status: normalizeStatus(rawStatus),
    estimated_wait_seconds: estimatedWaitSeconds,
    is_open: meta?.is_open === "true",
  }
}

export async function serveNextBatch(eventId: string, count: number): Promise<string[]> {
  const next = await redis.zrange(QUEUE_KEY(eventId), 0, count - 1, { withScores: true })
  if (!next || next.length === 0) return []

  const invited: string[] = []
  const now = new Date().toISOString()

  for (let i = 0; i < next.length; i += 2) {
    const userId = next[i] as string
    const score = next[i + 1] as number
    const raw = await redis.hget<string>(QUEUE_STATUS_KEY(eventId), userId)
    if (raw && raw !== "waiting") continue
    const data = { status: "invited", invited_at: now }
    await redis.hset(QUEUE_STATUS_KEY(eventId), { [userId]: JSON.stringify(data) })
    invited.push(userId)
  }

  const lastScore = next[next.length - 1] as number
  await redis.hset(QUEUE_META_KEY(eventId), { current_serving: lastScore.toString() })
  return invited
}

export async function markUserEntered(eventId: string, userId: string): Promise<void> {
  const entry = await redis.hget<string>(QUEUE_STATUS_KEY(eventId), userId)
  if (!entry) return

  let parsed: Record<string, unknown>
  try {
    parsed = JSON.parse(entry)
  } catch {
    parsed = { status: entry }
  }
  parsed.status = "entered"
  await redis.hset(QUEUE_STATUS_KEY(eventId), { [userId]: JSON.stringify(parsed) })
  await redis.zrem(QUEUE_KEY(eventId), userId)
}

export async function getQueueCount(eventId: string): Promise<number> {
  return redis.zcard(QUEUE_KEY(eventId))
}
