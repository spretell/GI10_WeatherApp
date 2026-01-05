// src/utils/forecast.js

// define an async function called forecast that gets weather data ; it takes latitude, longitude, and units (imperial or metric) as inputs
const forecast = async (latitude, longitude, units) => {
  // decide which temperature unit to use based on the units choice ; if units is "metric", use celsius, otherwise use fahrenheit
  const temperatureUnit = units === "metric" ? "celsius" : "fahrenheit";

  // decide which wind speed unit to use based on the units choice ; metric uses kilometers per hour, imperial uses miles per hour
  const windspeedUnit = units === "metric" ? "kmh" : "mph";

  // build the full api url using latitude, longitude, and unit choices
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=" +
    latitude +
    "&longitude=" +
    longitude +
    "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m" +
    "&temperature_unit=" +
    temperatureUnit +
    "&wind_speed_unit=" + // <-- fix here
    windspeedUnit;

  // make the request to the open-meteo api
  const response = await fetch(url);

  // if the api responds with an error status (not 200–299)
  if (!response.ok) {
    // read the raw response text so we can see the real error
    const text = await response.text();

    // throw a detailed error so it shows up in render logs
    throw new Error(
      `unable to connect to weather service. status: ${response.status} body: ${text}`
    );
  }

  // convert the successful response to json
  const data = await response.json();

  // grab only the "current" weather section from the api response
  const current = data.current;

  // create a map that translates weather codes into readable text ; the api returns numbers, so we convert them into descriptions
  const weatherCodeMap = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    80: "Rain showers",
    95: "Thunderstorm",
  };

  // return a clean object with only the data we care about ; this object will be sent back to the frontend
  return {
    // current temperature from the api
    temperature: current.temperature_2m,

    // what the temperature feels like to humans
    feelsLike: current.apparent_temperature,

    // current wind speed
    windSpeed: current.wind_speed_10m,

    // convert the weather code into readable text ; if code is unknown, use a fallback message
    description: weatherCodeMap[current.weather_code] || "Unknown conditions",

    // include units so the frontend knows how to label values
    units,
  };
};

// export the forecast function so other files can use it
module.exports = forecast;
