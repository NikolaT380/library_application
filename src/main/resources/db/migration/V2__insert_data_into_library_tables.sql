insert into country (name, continent)
values ('North Macedonia', 'Europe'),
       ('United Kingdom', 'Europe'),
       ('United States', 'North America');

insert into author (created_at, updated_at, name, surname, country_id)
values (now(), now(), 'Blaze', 'Koneski', (select id from country where name = 'North Macedonia')),
       (now(), now(), 'Petre', 'M. Andreevski', (select id from country where name = 'North Macedonia')),
       (now(), now(), 'J.K.', 'Rowling', (select id from country where name = 'United Kingdom')),
       (now(), now(), 'Stephen', 'King', (select id from country where name = 'United States'));

insert into book (created_at, updated_at, name, category, state, available_copies, author_id)
values (now(), now(), 'Pirej', 'NOVEL', 'GOOD', 5, (select id from author where surname = 'M. Andreevski')),
       (now(), now(), 'Harry Potter', 'FANTASY', 'GOOD', 10, (select id from author where surname = 'Rowling')),
       (now(), now(), 'The Shining', 'THRILLER', 'BAD', 0, (select id from author where surname = 'King')),
       (now(), now(), 'Zenski za raca', 'CLASSICS', 'GOOD', 3, (select id from author where surname = 'Koneski'));

