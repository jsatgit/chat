CREATE TABLE chat (
    id 			SERIAL PRIMARY KEY,
    message 	TEXT,
    sender		TEXT,
    room        INTEGER references room(id)
);
