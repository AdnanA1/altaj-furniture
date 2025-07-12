-- Enable RLS and add admin-only policies for all main tables

ALTER TABLE products ENABLE ROW LEVEL SECURITY
CREATE POLICY "Admins only" ON products
  FOR ALL
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

ALTER TABLE categories ENABLE ROW LEVEL SECURITY
CREATE POLICY "Admins only" ON categories
  FOR ALL
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

ALTER TABLE fabrics ENABLE ROW LEVEL SECURITY
CREATE POLICY "Admins only" ON fabrics
  FOR ALL
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

ALTER TABLE orders ENABLE ROW LEVEL SECURITY
CREATE POLICY "Admins only" ON orders
  FOR ALL
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin');

ALTER TABLE customers ENABLE ROW LEVEL SECURITY
CREATE POLICY "Admins only" ON customers
  FOR ALL
  USING (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'); 