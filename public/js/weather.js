const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// create a variable for the <form> element
const form = document.getElementById("form");

// create a variable for the text input where the user types a ZIP or city
const addressInput = document.getElementById("address");

// create a variable for the Search button so we can disable it while loading
const submitBtn = document.getElementById("submitBtn");

// create a variable for the element where we will print weather results / loading / errors
const output = document.getElementById("output");

// create a variable for the wrapper that holds the results area (used for opening/closing animation)
const resultWrap = document.getElementById("resultWrap");

// find the grid of neighborhood cards
const grid = document.querySelector(".cardGrid");

// run the observer code if the grid exists on this page
if (grid) {
  // create an IntersectionObserver that triggers when the cards scroll into view
  const obs = new IntersectionObserver(
    // runs when the grid enters or exits the screen
    (entries, observer) => {
      // loop through every "entry"
      for (const entry of entries) {
        // if the grid is NOT visible yet , skip to the next loop cycle
        if (!entry.isIntersecting) continue;

        // add the class that turns on the reveal animation in CSS
        grid.classList.add("reveal-on");

        // stop observing after the reveal happens
        observer.unobserve(entry.target);

        // exit
        break;
      }
    },

    // threshold 0.2 = 20% of the grid must be visible
    // rootMargin -10% = wait until it is a little more inside the screen
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  // start observing the grid
  obs.observe(grid);
}

// function to check which radio button is selected ( imperial or metric )
const getUnits = () => {
  // find whichever radio button is currently checked
  const checked = document.querySelector('input[name="units"]:checked');

  // if one is checked , return its value , otherwise default to "imperial"
  return checked ? checked.value : "imperial";
};

// function to add an animation class to the output so it fades / blurs in
const animateIn = (className) => {
  // remove animation classes first so the animation can replay each time
  output.classList.remove("wxFadeIn", "reveal");

  // wait until the next frame so the browser notices the class was removed then added back in ( to trigger the animation again)
  requestAnimationFrame(() => output.classList.add(className));
};

// function to show a "Loading..." message to the user
const renderLoading = () => {
  // open the results area ( if resultWrap exists )
  resultWrap.classList.add("open");

  // put a loading message inside the output area
  output.innerHTML = `<div class="small">Loading current conditions...</div>`;

  // animate the loading message in
  animateIn("wxFadeIn");
};

// function to show an error message to the user
const renderError = (msg) => {
  // open the results area so the user can see the error
  resultWrap.classList.add("open");

  // print the error message
  output.innerHTML = `<div class="error">${msg}</div>`;

  // animate the error message in
  animateIn("wxFadeIn");
};

// function to display the real weather data on the page
const renderWeather = (data, units) => {
  // pick the correct temperature symbol based on units
  const tempUnit = units === "metric" ? "°C" : "°F";

  // pick the correct wind speed unit based on units
  const windUnit = units === "metric" ? "km/h" : "mph";

  // open the results area so the user can see the data
  resultWrap.classList.add("open");

  // build the results HTML and insert it into the output area
  output.innerHTML = `
    <div class="wxLocation">${data.location}</div>
    <div class="wxDesc">${data.description}</div>

    <div class="wxTemp">
      ${Math.round(data.temperature)}${tempUnit}
    </div>

    <div class="wxFeels">
      Feels like ${Math.round(data.feelsLike)}${tempUnit}
    </div>

    <div class="wxMeta">
      Wind ${Math.round(data.windSpeed)} ${windUnit} • Updated just now
    </div>
  `;

  // animate the final results in (blur → sharp)
  animateIn("reveal");
};

// - - - weather page : form submit handler - - -

// listen for when the user submits the form
form.addEventListener("submit", async (e) => {
  // stop the browser from refreshing the page when the form submits
  e.preventDefault();

  // get the user's input and remove extra spaces
  const address = addressInput.value.trim();

  // get the unit choice from the radio buttons
  const units = getUnits();

  // if the user didn't type anything , show an error and stop
  if (!address) {
    renderError("Please enter a ZIP code or city.");
    return;
  }

  // disable the button so the user can't click Search multiple times
  submitBtn.disabled = true;

  // show the loading message
  renderLoading();

  try {
    // call backend API endpoint with address + units
    // encodeURIComponent makes the address safe for URLs (spaces, commas, etc.)
    const res = await fetch(
      `/api/weather?address=${encodeURIComponent(address)}&units=${units}`
    );

    // convert the response body into a JavaScript object
    const data = await res.json();

    // if the server returned an error status (like 400 or 500)
    if (!res.ok) {
      // show the server error message if it exists
      renderError(data.error || "Unable to fetch weather data.");
      return;
    }

    // if everything is good , show the weather results
    renderWeather(data, units);
  } catch (err) {
    // if the request failed (no internet, server down, etc.)
    renderError("Network error. Please try again.");
  } finally {
    // re-enable the button when done ( success / failure )
    submitBtn.disabled = false;
  }
});

// - - - weather page : clickable neighborhood cards - - -

// find all cards with the class "wxPick" and loop over them
document.querySelectorAll(".wxPick").forEach((card) => {
  // when the user clicks a card ...
  card.addEventListener("click", () => {
    // read the ZIP code stored in the card's data-zip attribute
    const zip = card.dataset.zip;

    // if there is no zip , return
    if (!zip) return;

    // put that ZIP into the input box
    addressInput.value = zip;

    // submit the form programmatically
    form.requestSubmit();
  });
});
