CREATE MATERIALIZED VIEW category_stats_materialized_view AS
SELECT
    category,
    COUNT(id) AS total_books,
    SUM(available_copies) AS total_available_copies,
    SUM(CASE WHEN state = 'BAD' THEN 1 ELSE 0 END) AS books_in_bad_condition
FROM book
GROUP BY category;