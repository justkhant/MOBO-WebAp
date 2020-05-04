"use strict";

const oracledb = require("oracledb");
const dbConfig = require("./db-config.js");

async function run(query, res) {
  let connection;
  let result;
  try {
    connection = await oracledb.getConnection(dbConfig);
    result = await connection.execute(query);
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    return result;
  }
}

async function insert(query, binds, res) {
  let connection;
  let result;
  try {
    connection = await oracledb.getConnection(dbConfig);
    result = await connection.execute(query, binds, { autoCommit: true });
    console.log("Number of inserted rows:", result.rowsAffected);
    return result;
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
    return result;
  }
}

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

// Given an ID, find the media item that matches - for details page
function getMediaInfo(req, res) {
  let query = `
  SELECT M.media_id, title, media_type, keywords, 
        (CASE media_type 
          WHEN 'M' THEN Mo.overview 
          ELSE B.description END) AS overview,
        avg_rating, image_url, release_date, 
        (CASE media_type 
           WHEN 'M' THEN Mo.rating_count 
           ELSE B.rating_count END) AS rating_count, 
        revenue, runtime, language, authors, pages, review_count
  FROM Media M LEFT OUTER JOIN Movies Mo ON M.media_id =  Mo.media_id LEFT OUTER JOIN Books B ON M.media_id = B.media_id
  WHERE M.media_id = ${req.params.id}
  `;

  run(query).then((response) => {
    res.json(response);
  });
}

function getMultipleMediaInfo(req, res) {
  console.log(JSON.parse(req.query.media_ids));
  var media_ids = JSON.parse(req.query.media_ids);
  let query = ``;
  if (media_ids.length > 0) {
    query = `
      SELECT M.media_id, title, media_type, keywords, 
            (CASE media_type 
                WHEN 'M' THEN Mo.overview 
                ELSE B.description END) AS overview,
            avg_rating, image_url, release_date, 
            (CASE media_type 
                WHEN 'M' THEN Mo.rating_count 
                ELSE B.rating_count END) AS rating_count, 
            revenue, runtime, language, authors, pages, review_count
      FROM Media M LEFT OUTER JOIN Movies Mo ON M.media_id =  Mo.media_id LEFT OUTER JOIN Books B ON M.media_id = B.media_id
      WHERE
    `;
  }
  media_ids.forEach(function (media_id) {
    query += ` M.media_id = ` + media_id + ` OR`;
  });

  query = query.substring(0, query.length - 2);

  console.log(query);
  run(query).then((response) => {
    res.json(response);
  });
}

function titleSearch(req, res) {
  var media = req.params.media;
  var genre = req.params.genre;
  var searchTitle = req.params.searchTitle;

  var query = "";
  if (media == "All") {
    if (genre == "All") {
      //search for all media, all genre
      query =
        `
        WITH queries AS (
          (SELECT LOWER('` +
        searchTitle +
        `') AS query
          FROM dual)
      )
      
      SELECT *
      FROM (
        SELECT media_id, title, media_type, avg_rating, UTL_MATCH.edit_distance_similarity(query, title) AS similarity
        FROM Media, queries
        WHERE (UTL_MATCH.edit_distance_similarity(query, LOWER(title)) > 80 OR (LOWER(title) LIKE CONCAT(CONCAT('%', query), '%')))
        ORDER BY similarity DESC
        )
      WHERE ROWNUM <= 30
    
        `;

      run(query).then((response) => {
        res.json(response);
      });
    }
  }
}

function getAllGenres(req, res) {}

function getRecs(req, res) {
  var searchId = req.params.searchId;
  var searchType = req.params.searchType;

  var query =
    `WITH input_keywords AS (
      SELECT DISTINCT media_id, title, trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) AS keyword
      FROM 
      Media, 
      table(cast(multiset(select level from dual connect by  level <= length (regexp_replace(Media.keywords, '[^,]+'))  + 1) as sys.OdciNumberList)) levels
      WHERE media_id = ` +
    searchId +
    ` AND trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) IS NOT NULL
  ),
  all_keywords AS (
      SELECT DISTINCT media_id, title, trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) AS keyword
      FROM 
      Media, 
      table(cast(multiset(select level from dual connect by  level <= length (regexp_replace(Media.keywords, '[^,]+'))  + 1) as sys.OdciNumberList)) levels
      WHERE media_id <> ` +
    searchId +
    ` AND trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) IS NOT NULL
  ), 
  keyword_match AS (
      SELECT media_id, title, SUM(score) AS score
      FROM (
          SELECT a.media_id, a.title, i.keyword, a.keyword, (30) AS score 
          From input_keywords i, all_keywords a
          WHERE i.keyword like a.keyword
          )
      GROUP BY media_id, title
  ),
  
  input_genre_similarity_id AS (
    SELECT DISTINCT M.media_id, M.title, Ge.similarity_id 
    FROM Media M JOIN Genres_to_media G ON M.media_id = G.media_id JOIN Genres Ge ON G.genre_name = Ge.genre_name
    WHERE M.media_id = ` +
    searchId +
    `
  ),
  
  genre_match AS (
    SELECT M.media_id, M.title, (COUNT(*) * 5) AS score
    FROM input_genre_similarity_id I JOIN Genres Ge ON I.similarity_id = Ge.similarity_id 
                                          JOIN Genres_to_media G ON Ge.genre_name = G.genre_name 
                                              JOIN Media M ON M.media_id = G.media_id 
      WHERE M.media_id <> ` +
    searchId +
    `
    GROUP BY M.media_id, M.title
  ),
  
  movie_info AS (
      SELECT Me.media_id, title, release_date
      FROM Media Me JOIN Movies M ON Me.media_id = M.media_id
  )
  ,
  input_decade AS (
      SELECT TO_NUMBER(EXTRACT(YEAR FROM release_date), '9999') - MOD((TO_NUMBER(EXTRACT(YEAR FROM release_date), '9999')), 10) AS decade
      FROM movie_info
      WHERE media_id = ` +
    searchId +
    `
  ),
  
  decade_match AS (
      SELECT media_id, title, 5 AS score
      FROM movie_info, input_decade 
      WHERE decade = TO_NUMBER(EXTRACT(YEAR FROM release_date), '9999') - MOD((TO_NUMBER(EXTRACT(YEAR FROM release_date), '9999')), 10) 
          AND media_id <> ` +
    searchId +
    `
  ),
  
  book_info AS (
      SELECT Me.media_id, title, B.authors
      FROM Media Me JOIN Books B ON Me.media_id = B.media_id
  ),
  
  input_authors AS (
      SELECT DISTINCT media_id, title, trim(regexp_substr(authors, '[^|]+', 1, levels.column_value)) AS author
      FROM book_info, table(cast(multiset(select level from dual connect by  level <= length (regexp_replace(authors, '[^|]+'))  + 1) as sys.OdciNumberList)) levels
      WHERE media_id = ` +
    searchId +
    ` AND trim(regexp_substr(authors, '[^|]+', 1, levels.column_value)) IS NOT NULL
  ),
  all_authors AS (
      SELECT DISTINCT media_id, title, trim(regexp_substr(authors, '[^|]+', 1, levels.column_value)) AS author
      FROM book_info, table(cast(multiset(select level from dual connect by  level <= length (regexp_replace(authors, '[^|]+'))  + 1) as sys.OdciNumberList)) levels
      WHERE media_id <> ` +
    searchId +
    ` AND trim(regexp_substr(authors, '[^|]+', 1, levels.column_value)) IS NOT NULL
  ),
  authors_match AS (
      SELECT media_id, title, SUM(score) AS score
      FROM (
          SELECT a.media_id, a.title, i.author, a.author, (30) AS score 
          From input_authors i, all_authors a
          WHERE i.author = a.author
          )
      GROUP BY media_id, title
  ),
  top_scores AS (
      SELECT media_id, title, SUM(score) AS match_score
      FROM ((SELECT* FROM keyword_match) UNION ALL (SELECT * FROM decade_match) 
                                          UNION ALL (SELECT * FROM genre_match) 
                                          UNION ALL (SELECT * FROM authors_match))
      GROUP BY media_id, title
      ORDER BY match_score DESC
  )
  
    SELECT *
      FROM (
          SELECT M.media_id, M.title, media_type, t.match_score, keywords, 
              (CASE media_type 
                  WHEN 'M' THEN Mo.overview 
                  ELSE B.description END) AS overview,
               avg_rating, image_url, release_date, 
              (CASE media_type 
                   WHEN 'M' THEN Mo.rating_count 
                  ELSE B.rating_count END) AS rating_count, 
              revenue, runtime, language, authors, pages, review_count
          FROM top_scores t INNER JOIN Media M ON t.media_id = M.media_id 
              LEFT OUTER JOIN Movies Mo ON t.media_id = Mo.media_id 
              LEFT OUTER JOIN Books B ON t.media_id = B.media_id
          WHERE media_type = '` +
    searchType +
    `'
      )
   WHERE ROWNUM <= 10
  `;

  run(query).then((response) => {
    console.log("response in rec query is", response);
    res.json(response);
  });
}

//FUN FACTS 

function getLongestMovie(req, res) {
  let query = `
  SELECT M.media_id, title, media_type, keywords, avg_rating, image_url, overview, release_date, rating_count, revenue, longest.runtime, language
  FROM (SELECT *
        FROM (SELECT runtime
                FROM Movies Mo
                WHERE runtime IS NOT NULL
                ORDER BY runtime DESC)
        WHERE ROWNUM <= 1) longest INNER JOIN Movies Mo ON longest.runtime = Mo.runtime
                            INNER JOIN Media M ON Mo.media_id = M.media_id 

  `;

  run(query).then((response) => {
    res.json(response);
  });
}

function getShortestMovie(req, res) {
  let query = `
  SELECT M.media_id, title, media_type, keywords, avg_rating, image_url, overview, release_date, rating_count, revenue, shortest.runtime, language
  FROM (SELECT *
        FROM (SELECT runtime
                FROM Movies Mo
                WHERE runtime IS NOT NULL AND runtime >= 40
                ORDER BY runtime)
        WHERE ROWNUM <= 1) shortest INNER JOIN Movies Mo ON shortest.runtime = Mo.runtime
                            INNER JOIN Media M ON Mo.media_id = M.media_id

  `;

  run(query).then((response) => {
    res.json(response);
  });
}

function getMostExpensiveMovie(req, res) {
  let query = `
  
    SELECT M.media_id, title, media_type, keywords, avg_rating, image_url, overview, release_date, rating_count, R.revenue, runtime, language
    FROM (SELECT *
          FROM (SELECT revenue
                  FROM Movies Mo
                  WHERE revenue IS NOT NULL
                 ORDER BY revenue DESC)
          WHERE ROWNUM <= 1) R INNER JOIN Movies Mo ON R.revenue = Mo.revenue
                              INNER JOIN Media M ON Mo.media_id = M.media_id
  `;

  run(query).then((response) => {
    res.json(response);
  });
}

function getAuthorWithMostBooks(req, res) {
  let query = `
  SELECT *
  FROM (SELECT author, COUNT(*) AS num_books
        FROM (SELECT DISTINCT media_id, trim(regexp_substr(authors, '[^|]+', 1, levels.column_value)) AS author
            FROM Books, table(cast(multiset(select level from dual connect by  level <= length (regexp_replace(authors, '[^|]+'))  + 1) as sys.OdciNumberList)) levels
            WHERE trim(regexp_substr(authors, '[^|]+', 1, levels.column_value)) IS NOT NULL)
        GROUP BY author
        ORDER BY num_books DESC)
  WHERE ROWNUM <= 1;  
  `;

  run(query).then((response) => {
    res.json(response);
  });
}

//USER LOGIN/SIGNUP

function createNewUser(req, res) {
  var username = req.params.username;
  var password = req.params.password;

  var query = "";
  query = `INSERT INTO Users VALUES (:1, :2)`;

  var binds = ["" + username, "" + password];

  console.log(binds);

  insert(query, binds).then(
    (response) => {
      res.status(201).send();
    },
    (err) => {
      console.log(err);
    }
  );
}

function getPassword(req, res) {
  var username = req.params.username;

  var query = "";
  query =
    `
       SELECT password
       FROM Users
       WHERE username = '` +
    username +
    `' 
        `;

  run(query).then((response) => {
    res.json(response);
  });
}

// SAVED PAGE MEDIA
function addToSavedMedia(req, res) {
  var username = req.params.username;
  var media_id = parseInt(req.params.media_id);

  var query = "";
  query = `INSERT INTO Saved_media VALUES (:1, :2)`;

  var binds = ["" + media_id, "" + username];

  console.log(binds);

  insert(query, binds).then(
    (data) => {
      console.log(data);
      res.status(201).send();
    },
    (err) => {
      console.log(err);
    }
  );
}

function getMediaFromUser(req, res) {
  var username = req.params.username;

  var query = "";
  query =
    `
       SELECT media_id
       FROM Saved_media
       WHERE username = '` +
    username +
    `' 
        `;

  run(query).then((response) => {
    console.log(response);
    res.json(response);
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  titleSearch: titleSearch,
  getRecs: getRecs,
  getMediaInfo: getMediaInfo,
  getAllGenres: getAllGenres,
  createNewUser: createNewUser,
  getPassword: getPassword,
  getMultipleMediaInfo: getMultipleMediaInfo,
  getMediaFromUser: getMediaFromUser,
  addToSavedMedia: addToSavedMedia,
};
