CREATE TABLE users (
	id int PRIMARY KEY NOT NULL AUTO_INCREMENT, 
	username VARCHAR(255) NOT NULL, 
	password VARCHAR(255) NOT NULL, 
	firstname VARCHAR(255), 
	lastname VARCHAR(255), 
	t411_username VARCHAR(255), 
	t411_password VARCHAR(255),
	rights int NOT NULL DEFAULT 0
)

CREATE TABLE torrents (
	id int PRIMARY KEY NOT NULL,
	name VARCHAR(255),
    category VARCHAR(255),
    rewritename VARCHAR(255),
    seeders int,
    leechers int,
    comments int,
    added DATETIME,
    size BIGINT,
    times_completed int,
    owner VARCHAR(255),
    categoryname VARCHAR(255),
    username VARCHAR(255)
)