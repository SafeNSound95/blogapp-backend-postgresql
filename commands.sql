 CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title)  VALUES ('J.K Rowling', 'www.jk.com','harry potter');

INSERT INTO blogs (author, url, title)  VALUES ('Ripley', 'www.blade.com','do androids dream?');