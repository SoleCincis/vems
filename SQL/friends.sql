DROP TABLE IF EXISTS friendship;
CREATE TABLE friendship(
    id SERIAL PRIMARY KEY,
    receiver_id INTEGER NOT NULL REFERENCES users(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN  DEFAULT false,
    created_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP

);
