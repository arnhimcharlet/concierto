export type SeatStatus = "available" | "held" | "sold"

export interface Event {
  id: string
  title: string
  description: string
  date_start: string
  date_end: string
  venue: string
  venue_logo?: string
  city: string
  country: string
  image_url: string
  artist_image_url?: string
  banner_color?: string
  category: string
  status: "draft" | "published" | "cancelled"
  on_sale_at: string
  created_at: string
  sponsors?: string[]
  tags?: string[]
}

export interface Seat {
  id: string
  event_id: string
  section: string
  row: string
  number: number
  tier: string
  price: number
  status: SeatStatus
  held_by?: string
  held_until?: string
}

export interface SeatTier {
  id: string
  event_id: string
  name: string
  price: number
  color: string
  description?: string
}

export interface VenueSection {
  id: string
  name: string
  label: string
  rows: number
  seats_per_row: number
  tier_id: string
}

export interface QueueEntry {
  event_id: string
  user_id: string
  position: number
  status: "waiting" | "invited" | "entered" | "expired"
  joined_at: string
  invited_at?: string
}

export interface Order {
  id: string
  user_id: string
  event_id: string
  status: "pending" | "completed" | "cancelled"
  total: number
  created_at: string
  expires_at: string
}

export interface OrderTicket {
  id: string
  order_id: string
  seat_id: string
  section: string
  row: string
  number: number
  tier: string
  ticket_code: string
  attendee_name: string
}

export interface UserProfile {
  id: string
  full_name: string
  email: string
  role: "user" | "admin"
  created_at: string
}

export interface QueueState {
  event_id: string
  position: number
  total_in_queue: number
  status: "waiting" | "invited" | "entered" | "expired"
  estimated_wait_seconds: number
  is_open: boolean
}
