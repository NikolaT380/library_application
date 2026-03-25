CREATE VIEW book_details_view AS
SELECT
    b.id AS book_id,
    b.name AS book_name,
    b.category AS book_category,
    b.state AS book_state,
    b.available_copies AS available_copies,
    CONCAT(a.name, ' ', a.surname) AS author_full_name,
    c.name AS country_name
FROM book b
         LEFT JOIN author a ON b.author_id = a.id
         LEFT JOIN country c ON a.country_id = c.id;