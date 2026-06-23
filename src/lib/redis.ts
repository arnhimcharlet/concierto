import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const QUEUE_KEY = (eventId: string) => `queue:${eventId}`
export const QUEUE_STATUS_KEY = (eventId: string) => `queue:status:${eventId}`
export const QUEUE_META_KEY = (eventId: string) => `queue:meta:${eventId}`
export const SEAT_HOLD_KEY = (seatId: string) => `seat:hold:${seatId}`
export const QUEUE_COUNTER_KEY = (eventId: string) => `queue:counter:${eventId}`
