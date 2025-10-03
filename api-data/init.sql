CREATE TABLE IF NOT EXISTS data_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO data_items (title, content, category) VALUES
  ('Welcome', 'Welcome to the microservices app', 'info'),
  ('Documentation', 'Full API documentation available', 'docs'),
  ('Update', 'New features released', 'news')
ON CONFLICT DO NOTHING;

