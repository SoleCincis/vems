// spice-pg connection to db(postgras)
const spicedPg = require("spiced-pg");

let db;

if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const secrets = require("../secrets.json");
    const user = secrets.username;
    const pass = secrets.password;
    db = spicedPg(`postgres:${user}:${pass}psql@localhost:5432/catnipsocial`);
}
//_________________COMUNICATING WITH DB______________
//------------registration---------------
module.exports.createUser = (first, last, email, hashedPass) => {
    return db
        .query(
            `
        INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `,
            [first, last, email, hashedPass]
        )
        .then(results => {
            return results.rows[0].id;
        });
};
//---------------login---------------
module.exports.userEmail = email => {
    return db
        .query(
            `
    SELECT *
    FROM users
    WHERE email = $1
    `,
            [email]
        )
        .then(results => {
            return results.rows[0];
        });
};
//--------------profile-------------
module.exports.userProfile = id => {
    return db
        .query(
            `
    SELECT first, last, imgUrl , bio
    FROM users
    WHERE id = $1
    `,
            [id]
        )
        .then(results => {
            return results.rows[0];
        });
};

//----------Uploader----------
exports.upImg = (url, id) => {
    return db
        .query(
            `UPDATE users
        SET imgUrl = $1
        WHERE id = $2
        RETURNING imgUrl`,
            [url, id]
        )
        .then(results => {
            return results.rows;
        });
};
//----------Bio--------------
exports.upBio = (id, bio) => {
    return db
        .query(
            `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING *`,
            [id, bio]
        )
        .then(results => {
            return results.rows;
        });
};
//-------------friedship-----------

exports.friendStatus = (id1, id2) => {
    return db
        .query(
            `SELECT * FROM friendship
        WHERE (sender_id =$1 AND receiver_id=$2)
        OR  (sender_id =$2 AND receiver_id=$1)
        `,
            [id1, id2]
        )
        .then(results => {
            return results.rows[0];
        });
};
//_____________REQUEST_________________
exports.friendRequest = (receiverId, senderId) => {
    return db
        .query(
            `INSERT INTO friendship
            (receiver_id, sender_id)
            VALUES ($1, $2)
            RETURNING *

        `,
            [receiverId, senderId]
        )
        .then(results => {
            return results.rows[0];
        });
};
//___________DELETE______________
exports.deleteFriend = (id1, id2) => {
    return db
        .query(
            `DELETE FROM friendship
        WHERE (sender_id =$1 AND receiver_id=$2)
        OR  (sender_id =$2 AND receiver_id=$1)
        `,
            [id1, id2]
        )
        .then(results => {
            return results.rows[0];
        });
};
//_________ACCEPTED____________
exports.acceptFriend = (id1, id2) => {
    return db
        .query(
            `UPDATE friendship
            SET accepted = true
        WHERE (sender_id =$1 AND receiver_id=$2)
        OR  (sender_id =$2 AND receiver_id=$1)
        RETURNING *
        `,
            [id1, id2]
        )
        .then(results => {
            return results.rows[0];
        });
};
exports.listFriend = id => {
    return db
        .query(
            `
            SELECT users.id, first, last, imgUrl, accepted
            FROM friendship
            JOIN users
            ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
            OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        `,
            [id]
        )
        .then(results => {
            return results.rows;
        });
};
