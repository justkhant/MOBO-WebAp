'use strict';

const oracledb = require('oracledb');
const dbConfig = require('./db-config.js');

async function run(query, res) {
  console.log(query);
  let connection;

  try {
    connection = await oracledb.getConnection(dbConfig);
    let result;
    result = await connection.execute(query);
    console.log(result)
    return result 
  } catch (err) {
    console.error(err);
  } finally {
    res.json(result);
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
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

  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function titleSearch(req, res) {
  var media = req.params.media;
  var genre = req.params.genre;
  var searchTitle = req.params.searchTitle;

  var query = '';
  if (media == "All") {
    if (genre=='All') {
      //search for all media, all genre
      query = `WITH queries AS (
        (SELECT DISTINCT trim(regexp_substr(LOWER('`+ searchTitle+ `'), '[^ ]+', 1, levels.column_value)) AS query
        FROM Media,
        table(cast(multiset(select level from dual connect by  level <= length (regexp_replace('`+ searchTitle + `', '[^ ]+'))  + 1) as sys.OdciNumberList)) levels
        WHERE trim(regexp_substr(Media.keywords, '[^,]+', 1, levels.column_value)) IS NOT NULL)
        UNION
        (SELECT DISTINCT '`+ searchTitle + `' AS query
        FROM Media))`

      run(query, res);
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

function getAllGenres(req, res) {

}

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
  getAllGenres: getAllGenres
};
