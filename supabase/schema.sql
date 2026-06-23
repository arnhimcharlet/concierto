-- Concierto Database Schema

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date_start TIMESTAMPTZ NOT NULL,
  date_end TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  venue_logo TEXT,
  city TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Philippines',
  image_url TEXT,
  artist_image_url TEXT,
  banner_color TEXT DEFAULT '#1a1a2e',
  category TEXT NOT NULL DEFAULT 'Concert',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  on_sale_at TIMESTAMPTZ NOT NULL,
  sponsors JSONB DEFAULT '[]'::jsonb,
  tags JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events"
  ON events FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage events"
  ON events FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Seat tiers
CREATE TABLE seat_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  color TEXT NOT NULL DEFAULT '#6366f1',
  description TEXT
);

ALTER TABLE seat_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view seat tiers"
  ON seat_tiers FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage seat tiers"
  ON seat_tiers FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Venue sections
CREATE TABLE venue_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  rows INTEGER NOT NULL,
  seats_per_row INTEGER NOT NULL,
  tier_id UUID NOT NULL REFERENCES seat_tiers(id) ON DELETE CASCADE
);

ALTER TABLE venue_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view venue sections"
  ON venue_sections FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage venue sections"
  ON venue_sections FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Seats
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  row TEXT NOT NULL,
  number INTEGER NOT NULL,
  tier TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'held', 'sold')),
  held_by UUID REFERENCES auth.users(id),
  held_until TIMESTAMPTZ,
  UNIQUE(event_id, section, row, number)
);

ALTER TABLE seats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available seats"
  ON seats FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage seats"
  ON seats FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  event_id UUID NOT NULL REFERENCES events(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Order tickets
CREATE TABLE order_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id),
  section TEXT NOT NULL,
  row TEXT NOT NULL,
  number INTEGER NOT NULL,
  tier TEXT NOT NULL,
  ticket_code TEXT NOT NULL UNIQUE,
  attendee_name TEXT NOT NULL
);

ALTER TABLE order_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tickets"
  ON order_tickets FOR SELECT
  USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all tickets"
  ON order_tickets FOR SELECT
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Users can create tickets"
  ON order_tickets FOR INSERT
  WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
