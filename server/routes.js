"use strict";

const oracledb = require("oracledb");
const dbConfig = require("./db-config.js");

async function run(query, res) {
  let connection;
  let result;
  try {
    connection = await oracledb.getConnection(dbConfig);
    result = await connection.execute(query);
    // console.log(result);
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

async function insert(query, res) {
  let connection;
  let result;
  try {
    connection = await oracledb.getConnection(dbConfig);
    result = await connection.execute(query, { autoCommit: true });
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

// TODO: Getting Media Info
// Given an ID, find the media item that matches - for details page
function getMediaInfo(req, res) {
  let query = `
    SELECT *
    FROM Media M JOIN Movies B ON M.media_id = B.media_id 
    WHERE M.media_id = ${req.params.id}
  `;

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
        // console.log('response in run query is', response);
        res.json(response);
      });
    }
  }
  // if (media == 'Books') {
  //   if (genre == 'All') {
  //     //search for books, all genres

  //   }
  // }

  // connection.query(query, function (err, rows, fields) {
  //   if (err) console.log(err);
  //   else {
  //     res.json(rows);
  //   }
  // });
}

function getAllGenres(req, res) {}

// TODO: Getting Media's Recommendations
// Given an ID, output a list of media items - for details page
function getRecs(req, res) {
  var searchTitle = req.params.searchTitle;

  var query =
    `WITH input_keywords AS (
      SELECT DISTINCT media_id, title, trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) AS keyword
      FROM 
      Media, 
      table(cast(multiset(select level from dual connect by  level <= length (regexp_replace(Media.keywords, '[^,]+'))  + 1) as sys.OdciNumberList)) levels
      WHERE title = '`+searchTitle+`' AND trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) IS NOT NULL
     ),
    all_keywords AS (
      SELECT DISTINCT media_id, title, trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) AS keyword
      FROM 
      Media, 
      table(cast(multiset(select level from dual connect by  level <= length (regexp_replace(Media.keywords, '[^,]+'))  + 1) as sys.OdciNumberList)) levels
      WHERE title <> '`+searchTitle+`' AND trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) IS NOT NULL
  ), 
  keyword_match AS (
      SELECT media_id, title, SUM(score) AS score
      FROM (
          SELECT a.media_id, a.title, i.keyword, a.keyword, (10) AS score 
          From input_keywords i, all_keywords a
          WHERE i.keyword like a.keyword
          )
      GROUP BY media_id, title
  ),
  
  input_genre AS (
    SELECT M.media_id, M.title, G.genre_name
    FROM Media M JOIN Genres_to_media G ON M.media_id = G.media_id
    WHERE M.title = '`+searchTitle+`' 
  ),
  genre_match AS (
    SELECT M.media_id, M.title, (COUNT(*) * 5) AS score
    FROM input_genre I JOIN Genres_to_media G ON I.genre_name = G.genre_name JOIN Media M ON M.media_id = G.media_id
      WHERE M.title <> '`+searchTitle+`'
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
      WHERE title = '`+searchTitle+`'
  ),
  decade_match AS (
      SELECT media_id, title, 2 AS score
      FROM movie_info, input_decade 
      WHERE decade = TO_NUMBER(EXTRACT(YEAR FROM release_date), '9999') - MOD((TO_NUMBER(EXTRACT(YEAR FROM release_date), '9999')), 10) 
          AND title <> '`+searchTitle+`'
  ),
  top_scores AS (
      SELECT *
      FROM (
          SELECT media_id, title, SUM(score) AS match_score
          FROM ((SELECT* FROM keyword_match) UNION ALL (SELECT * FROM decade_match) UNION ALL (SELECT * FROM genre_match))
          GROUP BY media_id, title
          ORDER BY match_score DESC
          )
      WHERE ROWNUM <= 10
  )
  
  SELECT t.media_id, t.title, media_type, keywords, avg_rating, image_url, overview, release_date, rating_count, revenue, runtime, language, match_score
  FROM top_scores t INNER JOIN Media m ON t.media_id = m.media_id INNER JOIN Movies mo ON t.media_id = mo.media_id
  `;

  run(query).then((response) => {
    // console.log('response in run query is', response);
    res.json(response);
  });
}


//USER LOGIN/SIGNUP

function createNewUser(req, res) {
  var username = req.params.username;
  var password = req.params.password;
  var age = req.params.age;
  var gender = req.params.gender;

  var query = "";
  query =
      `
      INSERT INTO Users
        (username, password, age, gender)
      VALUES
        ('`+ username +`', '`+ password +`', `+ age +`, '`+ gender +`')

      `;

    insert(query).then((response) => {
      // console.log('response in run query is', response);
      res.json(response);
    });
  }

  function getPassword(req, res) {
    var username = req.params.username;
  
    var query = "";
    query =
        `
       SELECT password
       FROM Users
       WHERE username = '`+ username +`' 
        `;
  
      run(query).then((response) => {
        // console.log('response in run query is', response);
        res.json(response);
      });
    }


// The exported functions, which can be accessed in index.js.
module.exports = {
  titleSearch: titleSearch,
  getRecs: getRecs,
  getMediaInfo: getMediaInfo,
  getAllGenres: getAllGenres,
};
