// src/utils/geocode.js

// create variable to check if input is a 5-digit us zip code ; trim spaces and use a regular expression to match exactly 5 numbers
const isZip = (text) => /^\d{5}$/.test(text.trim());

// define an async function called geocode that turns a location into coordinates ; takes a city name, place name, or zip code as input
const geocode = async (input) => {
  // remove extra spaces from the user input
  const query = input.trim();

  // check if the input is a valid us zip code
  if (isZip(query)) {
    // build the api url for the zippopotam.us service using the zip code
    const zipUrl = `https://api.zippopotam.us/us/${query}`;

    // send a request to the zip code api and wait for the response
    const zipRes = await fetch(zipUrl);

    // if the request failed , throw an error for the user
    if (!zipRes.ok) {
      throw new Error("ZIP code not found. Try another ZIP.");
    }

    // convert the api response from json into a javascript object
    const zipData = await zipRes.json();

    // grab the first place result from the response (if it exists)
    // the question mark prevents errors if places is missing
    const place = zipData.places?.[0];

    // if no place data was found , throw an error
    if (!place) {
      throw new Error("ZIP code not found. Try another ZIP.");
    }

    // return latitude , longitude , and a formatted location string
    return {
      // convert latitude to a number ( api returns strings )
      latitude: Number(place.latitude),

      // convert longitude to a number ( api returns strings )
      longitude: Number(place.longitude),

      // build a readable location name like " city , state zip"
      location: `${place["place name"]}, ${place["state abbreviation"]} ${query}`,
    };
  }

  // if the input is not a zip code , use open-meteo's geocoding api instead
  const geoUrl =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(query) +
    "&count=1&language=en&format=json";

  // send a request to the geocoding api and wait for the response
  const geoRes = await fetch(geoUrl);

  // if the request failed , throw an error
  if (!geoRes.ok) {
    throw new Error("Unable to connect to location service.");
  }

  // convert the api response from json into a javascript object
  const geoData = await geoRes.json();

  // check if the api returned any results
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("Unable to find location. Try another search.");
  }

  // grab the first matching location result
  const place = geoData.results[0];

  // create an array of name parts ( city , state/region , country ) ; filter removes any missing or undefined values
  const nameParts = [place.name, place.admin1, place.country].filter(Boolean);

  // return latitude , longitude , and a formatted location name
  return {
    // latitude of the selected location
    latitude: place.latitude,

    // longitude of the selected location
    longitude: place.longitude,

    // join name parts into a readable string
    location: nameParts.join(", "),
  };
};

// export the geocode function so other files can use it
module.exports = geocode;
