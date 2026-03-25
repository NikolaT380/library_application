CREATE TABLE activity_log (
    id BIGSERIAL PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP NOT NULL
);
