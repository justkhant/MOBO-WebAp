const bodyParser = require("body-parser");
const express = require("express");
var routes = require("./routes.js");
const cors = require("cors");

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

/* ---- (Dashboard) ---- */
// The route localhost:8081/genres is registered to the function
// routes.getAllGenres, specified in routes.js.
app.get("/genres", routes.getAllGenres);

// get search result for a certain search term
app.get("/search/:media/:genre/:searchTitle", routes.titleSearch);

// Get a media's recommendations based on Media ID
app.get("/recommendations/:id", routes.getRecs);

// Get a media's information based on Media ID
app.get("/media/:id", routes.getMediaInfo);

app.get("/register/:username/:password", routes.createNewUser);

app.get("/login/:username", routes.getPassword);

app.get("/mediaMultiple/:media_ids", routes.getMultipleMediaInfo);

process.once("SIGTERM", process.exit);
process.once("SIGINT", process.exit);

app.listen(8081, () => {
  console.log(`Server listening on PORT 8081`);
});
