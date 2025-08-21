CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) VALUES ('Matihas', 'https://firstblog.com', 'Primer Blog');

INSERT INTO blogs (author, url, title) VALUES ('Mati', 'https://secondblog.com', 'Segundo Blog');