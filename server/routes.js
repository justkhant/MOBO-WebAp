"use strict";

const oracledb = require("oracledb");
const dbConfig = require("./db-config.js");

async function run(query, res) {
  let connection;
  let result;
  try {
    connection = await oracledb.getConnection(dbConfig);
    result = await connection.execute(query);
    console.log(result);
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
    FROM Media
    WHERE media_id = ${req.params.id};
  `;

  run(query);
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
        `WITH queries AS (
        (SELECT DISTINCT trim(regexp_substr(LOWER('` +
        searchTitle +
        `'), '[^ ]+', 1, levels.column_value)) AS query
        FROM Media,
        table(cast(multiset(select level from dual connect by  level <= length (regexp_replace('` +
        searchTitle +
        `', '[^ ]+'))  + 1) as sys.OdciNumberList)) levels
        WHERE trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) IS NOT NULL)
        UNION
        (SELECT DISTINCT '` +
        searchTitle +
        `' AS query
        FROM Media)
    ) SELECT *
    FROM (
        SELECT media_id, title, language, release_date, avg_rating, media_type, UTL_MATCH.edit_distance_similarity(query, title) AS similarity
        FROM Media, queries
        WHERE (UTL_MATCH.edit_distance_similarity(query, LOWER(title)) > 80 OR (LOWER(title) LIKE CONCAT(CONCAT('%', query), '%')))
        ORDER BY similarity DESC
        )
    WHERE ROWNUM <= 10
    
    `;
      res.json(run(query));
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
  let query = `
    SELECT *
    FROM Media
    WHERE media_id = ${req.params.id};
  `;

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  titleSearch: titleSearch,
  getRecs: getRecs,
  getMediaInfo: getMediaInfo,
  getAllGenres: getAllGenres,
};
