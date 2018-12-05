DROP TABLE IF EXISTS friendship;
CREATE TABLE friendship(
    id SERIAL PRIMARY KEY,
    reciver_id INTEGER NOT NULL REFERENCES users(id),
    sender_id INTEGER NOT NULL REFERENCES users(id),
    accepted BOOLEAN false,
    created_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP

);

-- ________query_________

-- exports.getFriend = (id1, id2) => {
--     return db
--         .query(
--             `SELECT *
--         FROM friends
--         WHERE (receiver = $1 AND sender = $2)
--         OR (receiver = $2 AND sender = $1)`,
--             [id1, id2]
--         )
--         .then(results => {
--             return results.rows;
--         });
-- };
--
-- exports.makeFriend = (receiver, sender) => {
--     return db
--         .query(
--             `INSERT INTO friends (receiver, sender)
--         VALUES ($1, $2)
--         RETURNING *`,
--             [receiver, sender]
--         )
--         .then(results => {
--             return results.rows;
--         });
-- };
--
-- exports.cancelFriend = (receiver, sender) => {
--     return db
--         .query(
--             `DELETE FROM friends
--             WHERE (receiver = $1 AND sender = $2)
--             RETURNING *`,
--             [receiver, sender]
--         )
--         .then(results => {
--             return results.rows;
--         });
-- };
--
-- exports.acceptFriend = (receiver, sender) => {
--     return db
--         .query(
--             `UPDATE friends
--             SET accepted = true
--             WHERE (receiver = $1 AND sender = $2)
--             RETURNING *`,
--             [receiver, sender]
--         )
--         .then(results => {
--             return results.rows;
--         });
-- };
--
-- exports.deleteFriend = (id1, id2) => {
--     return db
--         .query(
--             `DELETE FROM friends
--             WHERE (receiver = $1 AND sender = $2)
--             OR (receiver = $2 AND sender = $1)
--             RETURNING *`,
--             [id1, id2]
--         )
--         .then(results => {
--             return results.rows;
--         });
-- };
