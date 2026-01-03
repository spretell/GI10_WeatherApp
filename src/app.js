// src/app.js

// import node's built-in path module to work with file paths
const path = require("path");

// import the express library to create a web server
const express = require("express");

// import the geocode helper function from the utils folder
const geocode = require("./utils/geocode");

// import the forecast helper function from the utils folder
const forecast = require("./utils/forecast");

// create an express application instance
const app = express();

// set the port number
const port = process.env.PORT || 3000;

// create an absolute path to the public folder
const publicDir = path.join(__dirname, "../public");

// tell express to serve static files from the public directory
app.use(express.static(publicDir));

// define the route for the home page
app.get("/", (req, res) => {
  // send the index.html file to the browser
  res.sendFile(path.join(publicDir, "pages", "index.html"));
});

// define the route for the weather page
app.get("/weather", (req, res) => {
  // send the weather.html file to the browser
  res.sendFile(path.join(publicDir, "pages", "weather.html"));
});

// define the route for the about page
app.get("/about", (req, res) => {
  // send the about.html file to the browser
  res.sendFile(path.join(publicDir, "pages", "about.html"));
});

// define an api route for fetching weather data
app.get("/api/weather", async (req, res) => {
  // read the address query parameter from the url ; if does not exist , default to empty string
  const address = (req.query.address || "").trim();

  // read the units query parameter ( imperial or metric ) ;default to imperial and convert to lowercase
  const units = (req.query.units || "imperial").toLowerCase();

  // check that the user provided an address or zip code
  if (!address) {
    // send a 400 bad request error if missing
    return res
      .status(400)
      .send({ error: "You must provide an address or ZIP." });
  }

  // check that units is either imperial or metric
  if (!["imperial", "metric"].includes(units)) {
    // send a 400 bad request error if units are invalid
    return res.status(400).send({ error: "Units must be imperial or metric." });
  }

  try {
    // convert the address into latitude and longitude
    const geo = await geocode(address);

    // fetch the weather using the coordinates and units
    const wx = await forecast(geo.latitude, geo.longitude, units);

    // send a clean json response back to the browser
    res.send({
      // readable location name
      location: geo.location,

      // original address provided by the user
      address,

      // spread the weather data into this object
      ...wx,
    });
  } catch (e) {
    // get the error message or use a fallback
    const msg = e?.message || "Something went wrong.";

    // convert the error message to lowercase for checking
    const lower = msg.toLowerCase();

    // determine if the error was caused by user input
    const isUserInputError =
      lower.includes("not found") ||
      lower.includes("unable to find") ||
      lower.includes("try another") ||
      lower.includes("you must provide");

    // send a 400 error for user mistakes, otherwise 500 for server errors
    res.status(isUserInputError ? 400 : 500).send({ error: msg });
  }
});

// catch-all route for any pages that do not exist
app.use((req, res) => {
  // send a 404 status and message
  res.status(404).send("404 - Page not found");
});

// start the server and listen on the chosen port
app.listen(port, () => {
  // log a message so i know the server is running
  console.log("Server up on port " + port);
});
