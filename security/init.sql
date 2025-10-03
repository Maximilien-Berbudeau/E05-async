CREATE TABLE IF NOT EXISTS auth_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS permissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES auth_users(id),
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password: admin123
INSERT INTO auth_users (email, password_hash, role) VALUES
  ('admin@example.com', '$2b$10$MxQmI6VVKhxjX4G.UAx29e87tR99Q8cDBIAcCdAthxvs6MJo6F5xe', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO permissions (user_id, resource, action) VALUES
  (1, 'users', 'read'),
  (1, 'users', 'write'),
  (1, 'data', 'read'),
  (1, 'data', 'write')
ON CONFLICT DO NOTHING;

