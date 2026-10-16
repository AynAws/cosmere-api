INSERT INTO books VALUES ('elantris', 'Elantris', '2005-05-01', 'Elantris', 1, 'Novel');

INSERT INTO books VALUES ('hope-of-elantris', 'The Hope of Elantris', '2006-01-01', 'Elantris', 1.1, 'Short Story');
INSERT INTO prerequisites VALUES ('elantris', 'hope-of-elantris');

INSERT INTO books VALUES ('mistborn-final-empire', 'Mistborn: The Final Empire', '2006-07-17', 'Mistborn (Era 1)', 1, 'Novel');

INSERT INTO books VALUES ('mistborn-well-of-ascension', 'The Well of Ascension', '2007-08-21', 'Mistborn (Era 1)', 2, 'Novel');
INSERT INTO prerequisites VALUES ('mistborn-final-empire', 'mistborn-well-of-ascension');

INSERT INTO books VALUES ('mistborn-hero-of-ages', 'The Hero of Ages', '2008-10-14', 'Mistborn (Era 1)', 3, 'Novel');
INSERT INTO prerequisites VALUES ('mistborn-well-of-ascension', 'mistborn-hero-of-ages');

INSERT INTO books VALUES ('warbreaker', 'Warbreaker', '2009-06-09', NULL, NULL, 'Novel');