-- Seed data for Concierto demo

-- Events
INSERT INTO events (title, description, date_start, date_end, venue, city, country, image_url, artist_image_url, category, status, on_sale_at, sponsors, tags)
VALUES
(
  'BTS WORLD TOUR ''ARIRANG'' IN BULACAN',
  'BTS brings their record-breaking ARIRANG world tour to the Philippine Sports Stadium in Bulacan. Experience the energy of seven incredible performers in a landmark concert event.',
  '2027-03-13 18:00:00+08',
  '2027-03-16 23:00:00+08',
  'Philippine Sports Stadium',
  'Bulacan',
  'Philippines',
  '/images/bts-concert.jpg',
  '/images/bts-artist.jpg',
  'Concert',
  'published',
  '2027-01-15 10:00:00+08',
  '["B&P", "HYBE", "Live Nation", "Visa", "Samsung", "ARIH"]'::jsonb,
  '["K-Pop", "BTS", "World Tour", "ARIRANG"]'::jsonb
),
(
  'TAYLOR SWIFT | THE ERAS TOUR',
  'Taylor Swift brings The Eras Tour to Manila for three unforgettable nights at the Philippine Arena.',
  '2027-02-20 19:00:00+08',
  '2027-02-22 23:00:00+08',
  'Philippine Arena',
  'Bocaue',
  'Philippines',
  '/images/taylor-concert.jpg',
  '/images/taylor-artist.jpg',
  'Concert',
  'published',
  '2026-12-01 10:00:00+08',
  '["Live Nation", "Visa", "Coca-Cola"]'::jsonb,
  '["Pop", "Taylor Swift", "Eras Tour"]'::jsonb
);

-- Seat tiers for BTS event
WITH bts_event AS (SELECT id FROM events WHERE title LIKE 'BTS%' LIMIT 1)
INSERT INTO seat_tiers (event_id, name, price, color, description)
SELECT id, 'VIP', 15000.00, '#f59e0b', 'Best view, exclusive merch, early entry' FROM bts_event
UNION ALL
SELECT id, 'Gold', 10000.00, '#ef4444', 'Premium seating with great view' FROM bts_event
UNION ALL
SELECT id, 'Regular', 5500.00, '#3b82f6', 'Standard seating, good view' FROM bts_event
UNION ALL
SELECT id, 'Balcony', 2500.00, '#8b5cf6', 'Upper level, affordable option' FROM bts_event;

-- Seat tiers for Taylor Swift event
WITH ts_event AS (SELECT id FROM events WHERE title LIKE 'TAYLOR%' LIMIT 1)
INSERT INTO seat_tiers (event_id, name, price, color, description)
SELECT id, 'VIP', 18000.00, '#f59e0b', 'Best view, exclusive merch, early entry' FROM ts_event
UNION ALL
SELECT id, 'Gold', 12000.00, '#ef4444', 'Premium seating with great view' FROM ts_event
UNION ALL
SELECT id, 'Regular', 6500.00, '#3b82f6', 'Standard seating, good view' FROM ts_event
UNION ALL
SELECT id, 'Balcony', 3000.00, '#8b5cf6', 'Upper level, affordable option' FROM ts_event;

-- Venue sections for BTS (Philippine Sports Stadium)
WITH
  bts AS (SELECT id FROM events WHERE title LIKE 'BTS%' LIMIT 1),
  v As (SELECT id, name FROM seat_tiers WHERE event_id = (SELECT id FROM bts))
INSERT INTO venue_sections (event_id, name, label, rows, seats_per_row, tier_id)
SELECT (SELECT id FROM bts), 'VIP-A', 'VIP Section A', 5, 8, (SELECT id FROM v WHERE name = 'VIP')
UNION ALL
SELECT (SELECT id FROM bts), 'VIP-B', 'VIP Section B', 5, 8, (SELECT id FROM v WHERE name = 'VIP')
UNION ALL
SELECT (SELECT id FROM bts), 'GOLD-A', 'Gold Section A', 8, 12, (SELECT id FROM v WHERE name = 'Gold')
UNION ALL
SELECT (SELECT id FROM bts), 'GOLD-B', 'Gold Section B', 8, 12, (SELECT id FROM v WHERE name = 'Gold')
UNION ALL
SELECT (SELECT id FROM bts), 'REG-A', 'Regular Section A', 10, 15, (SELECT id FROM v WHERE name = 'Regular')
UNION ALL
SELECT (SELECT id FROM bts), 'REG-B', 'Regular Section B', 10, 15, (SELECT id FROM v WHERE name = 'Regular')
UNION ALL
SELECT (SELECT id FROM bts), 'BAL-A', 'Balcony Section A', 6, 20, (SELECT id FROM v WHERE name = 'Balcony');

-- Generate seats for BTS event
DO $$
DECLARE
  bts_id UUID;
  sec RECORD;
  r INTEGER;
  s INTEGER;
BEGIN
  SELECT id INTO bts_id FROM events WHERE title LIKE 'BTS%' LIMIT 1;
  FOR sec IN SELECT * FROM venue_sections WHERE event_id = bts_id LOOP
    FOR r IN 1..sec.rows LOOP
      FOR s IN 1..sec.seats_per_row LOOP
        INSERT INTO seats (event_id, section, row, number, tier, price)
        VALUES (
          bts_id,
          sec.name,
          chr(64 + r),
          s,
          (SELECT name FROM seat_tiers WHERE id = sec.tier_id),
          (SELECT price FROM seat_tiers WHERE id = sec.tier_id)
        );
      END LOOP;
    END LOOP;
  END LOOP;
END $$;
