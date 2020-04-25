var config = require("./db-config.js");
var mysql = require("mysql");

config.connectionLimit = 10;
var connection = mysql.createPool(config);

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
  getAllGenres: getAllGenres,
  getTopInGenre: getTopInGenre,
  getRecs: getRecs,
  getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
};
