DROP TABLE IF EXISTS prerequisites;
DROP TABLE IF EXISTS prerecommendations;
DROP TABLE IF EXISTS books;

CREATE TABLE books (
id TEXT PRIMARY KEY,
title TEXT NOT NULL,
release_date TEXT,
series_name TEXT,
series_order REAL,
length TEXT NOT NULL CHECK (length IN('Novel', 'Short Story', 'Novella', 'Graphic Novel', 'Bonus Content'))
);

CREATE TABLE prerequisites (
requires_id TEXT NOT NULL,
book_id TEXT NOT NULL,
FOREIGN KEY (requires_id) REFERENCES books(id),
FOREIGN KEY (book_id) REFERENCES books(id),
PRIMARY KEY (requires_id, book_id)
);
CREATE TABLE prerecommendations (
recommends_id TEXT NOT NULL,
book_id TEXT NOT NULL,
FOREIGN KEY (recommends_id) REFERENCES books(id),
FOREIGN KEY (book_id) REFERENCES books(id),
PRIMARY KEY (recommends_id, book_id)
);