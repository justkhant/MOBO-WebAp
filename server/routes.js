var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
function getAllGenres(req, res) {
  let query = `
    SELECT DISTINCT genre
    FROM Genres;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


/* ---- Q1b (Dashboard) ---- */
function getTopInGenre(req, res) {
  let query = `
    SELECT title, rating, vote_count 
    FROM Genres JOIN Movies
    ON Genres.movie_id = Movies.id
    WHERE Genres.genre = '${req.params.genre}'
    ORDER BY rating DESC, vote_count DESC 
    LIMIT 10; 
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- Q2 (Recommendations) ---- */
function getRecs(req, res) {
  let query = `
    WITH matching_genres AS (SELECT genre
    FROM Genres JOIN Movies
    ON Genres.movie_id = Movies.id
    WHERE Movies.title = '${req.params.title}')
    
    SELECT title, id, rating, vote_count 
    FROM Movies JOIN (
    SELECT movie_id, COUNT(*)
    FROM Genres 
    WHERE Genres.genre IN (SELECT genre FROM matching_genres)
    GROUP BY movie_id
    HAVING COUNT(*) >= ALL (
    SELECT COUNT(*) FROM (
    SELECT genre FROM matching_genres) C
    ) 
    ) A
    ON Movies.id = A.movie_id
    WHERE Movies.title <> '${req.params.title}'
    ORDER BY rating DESC, vote_count DESC
    LIMIT 5;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

/* ---- (Best Genres) ---- */
function getDecades(req, res) {
	var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) y
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Q3 (Best Genres) ---- */
function bestGenresPerDecade(req, res) {
  var query = `
    WITH distinct_genres AS (SELECT DISTINCT genre FROM Genres)

    SELECT distinct_genres.genre, IFNULL(avg_rating, 0) AS avg_rating, IFNULL(decade, ${req.params.decade}) AS decade
    FROM distinct_genres LEFT JOIN (
      SELECT floor(release_year / 10) * 10 AS decade, genre, AVG(rating) AS avg_rating
      FROM(
        SELECT release_year, genre, rating
        FROM Movies JOIN Genres
        ON Movies.id = Genres.movie_id) A
      WHERE floor(release_year / 10) * 10 = ${req.params.decade}
      GROUP BY floor(release_year / 10) * 10, genre) decade_genre_rating
    ON distinct_genres.genre = decade_genre_rating.genre
    ORDER BY avg_rating DESC, genre;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
	getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade
}