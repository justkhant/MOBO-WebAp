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
        SELECT media_id, title, media_type, UTL_MATCH.edit_distance_similarity(query, title) AS similarity
        FROM Media, queries
        WHERE (UTL_MATCH.edit_distance_similarity(query, LOWER(title)) > 80 OR (LOWER(title) LIKE CONCAT(CONCAT('%', query), '%')))
        ORDER BY similarity DESC
        )
      WHERE ROWNUM <= 30;
    
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
    `WITH queries AS (
          (SELECT '` +
    searchTitle +
    `' AS query
          FROM dual)
      ), 
      all_info AS (
          SELECT M.media_id, M.title, Mo.language, Mo.release_date, M.avg_rating, M.media_type, Mo.overview, Mo.rating_count, Mo.revenue, Mo.runtime, M.keywords
          FROM Media M JOIN Movies Mo ON M.media_id = Mo.media_id
      ),
      title_match AS (
          SELECT media_id, title, 
              (UTL_MATCH.edit_distance_similarity(query, LOWER(title))) * 10 AS score
          FROM all_info, queries
          WHERE (UTL_MATCH.edit_distance_similarity(query, LOWER(title)) > 80 OR (LOWER(title) LIKE CONCAT(CONCAT('%', query), '%')))
          ORDER BY score
      ),
      overview_match AS (
          SELECT media_id, title, 50 AS score
          FROM all_info, queries
          WHERE (UTL_MATCH.edit_distance_similarity(query, LOWER(overview)) > 80 OR (LOWER(overview) LIKE CONCAT(CONCAT('%', query), '%'))) 
          ORDER BY score
      ),
      all_keywords AS (
          SELECT DISTINCT media_id, title, language, release_date, media_type, trim(regexp_substr(all_info.keywords, '[^,]+', 1, levels.column_value)) AS keyword
          FROM 
          all_info, 
          table(cast(multiset(select level from dual connect by  level <= length (regexp_replace(all_info.keywords, '[^,]+'))  + 1) as sys.OdciNumberList)) levels
          WHERE trim(regexp_substr(all_info.keywords, '[^,]+', 1, levels.column_value)) IS NOT NULL
      ), 
      keyword_match AS (
          SELECT media_id, title, SUM(score) AS score
          FROM (
              SELECT a.media_id, a.title, a.keyword, a.keyword, (100) AS score 
              From all_keywords a, queries
              WHERE (UTL_MATCH.edit_distance_similarity(query, LOWER(a.keyword)) > 80 OR (LOWER(a.keyword) LIKE CONCAT(CONCAT('%', query), '%'))) 
              )
          GROUP BY media_id, title
      )
      
      SELECT *
      FROM (
          SELECT media_id, title, SUM(score) AS match_score
          FROM ((SELECT* FROM title_match) UNION ALL (SELECT * FROM overview_match) UNION ALL (SELECT * FROM keyword_match))
          GROUP BY media_id, title
        ORDER BY match_score DESC
          )
      WHERE ROWNUM <= 8
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
