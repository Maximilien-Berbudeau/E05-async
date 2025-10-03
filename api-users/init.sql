-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email, role, status) VALUES
  ('Alice', 'alice@example.com', 'admin', 'active'),
  ('Bob', 'bob@example.com', 'user', 'active'),
  ('Charlie', 'charlie@example.com', 'user', 'inactive')
ON CONFLICT (email) DO NOTHING;

