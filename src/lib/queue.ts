import { redis, QUEUE_KEY, QUEUE_STATUS_KEY, QUEUE_META_KEY, QUEUE_COUNTER_KEY } from "./redis"
import { QUEUE_OPEN_BEFORE_SECONDS, TURN_TIMEOUT_SECONDS } from "./constants"
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

export async function getQueuePosition(eventId: string, userId: string): Promise<QueueState | null> {
  const rank = await redis.zrank(QUEUE_KEY(eventId), userId)
  const total = await redis.zcard(QUEUE_KEY(eventId))
  const status = await redis.hget<string>(QUEUE_STATUS_KEY(eventId), userId)

  if (rank === null || !status) return null

  const meta = await redis.hgetall<{ current_serving?: string; is_open?: string }>(QUEUE_META_KEY(eventId))
  const currentServing = meta?.current_serving ? parseInt(meta.current_serving) : 0
  const positionsAhead = rank
  const estimatedWaitSeconds = positionsAhead * 2

  return {
    event_id: eventId,
    position: rank + 1,
    total_in_queue: total,
    status: status as QueueState["status"],
    estimated_wait_seconds: estimatedWaitSeconds,
    is_open: meta?.is_open === "true",
  }
}

export async function serveNextUser(eventId: string): Promise<string | null> {
  const next = await redis.zpopmin(QUEUE_KEY(eventId), 1)
  if (!next || next.length === 0) return null
  const entry = next[0] as { member: string; score: number }
  const userId = entry.member
  const data = { status: "invited", invited_at: new Date().toISOString() }
  await redis.hset(QUEUE_STATUS_KEY(eventId), { [userId]: JSON.stringify(data) })
  await redis.hset(QUEUE_META_KEY(eventId), { current_serving: entry.score.toString() })
  await redis.expire(QUEUE_KEY(eventId), TURN_TIMEOUT_SECONDS)
  return userId
}

export async function markUserEntered(eventId: string, userId: string): Promise<void> {
  const entry = await redis.hget<string>(QUEUE_STATUS_KEY(eventId), userId)
  if (entry) {
    const parsed = JSON.parse(entry)
    parsed.status = "entered"
    await redis.hset(QUEUE_STATUS_KEY(eventId), { [userId]: JSON.stringify(parsed) })
  }
}

export async function getQueueCount(eventId: string): Promise<number> {
  return redis.zcard(QUEUE_KEY(eventId))
}
