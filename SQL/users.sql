DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY UNIQUE,
    first VARCHAR(300) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    imgUrl TEXT,
    bio TEXT,
    createtime TIMESTAMP DEFAULT current_timestamp 
);
