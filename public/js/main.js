// wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // - - - home page : neighborhood cards reveal - - -

  // created variabled found by class name .cardGrid
  const grid = document.querySelector(".cardGrid");

  // only run code if grid exists on the page
  if (grid) {
    // created variable obs for new IntersectionObserver
    const obs = new IntersectionObserver(
      // this function runs whenever the grid enters /leaves the screen
      (entries, observer) => {
        // loops through all the entries
        for (const entry of entries) {
          // check if the grid is currently visible on screen
          if (entry.isIntersecting) {
            // add the class that triggers the CSS reveal animation
            grid.classList.add("reveal-on");

            // stop observing after it reveals once (so it doesn't repeat)
            observer.unobserve(entry.target);

            // exit the loop early since we already did the reveal
            break;
          }
        }
      },
      // how much is visible before triggering the observer
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    // start observing the grid element
    obs.observe(grid);
  }

  // - - - home page : slow down zip card background video - - -

  // find the video element that has the class "zipCardVideo"
  const zipVideo = document.querySelector(".zipCardVideo");

  // only run this if that video exists on this page
  if (zipVideo) {
    // when the video starts playing, set the speed slower
    zipVideo.addEventListener("play", () => {
      // set playback speed ( 1.0 is normal speed, 0.6 is slower )
      zipVideo.playbackRate = 0.6;
    });

    // set it immediately
    zipVideo.playbackRate = 0.6;
  }

  // - - - home page : ZIP card reveal - - -

  // find the zip guide card that has both classes "zipGuideCard" and "zip-reveal"
  const zipCard = document.querySelector(".zipGuideCard.zip-reveal");

  // only run this code if that zip card exists
  if (zipCard) {
    // create another observer just for the zip card
    const zipObs = new IntersectionObserver(
      // this runs when the zip card enters / leaves the screen
      (entries, observer) => {
        // loop through entries
        for (const entry of entries) {
          // if it's not on screen , skip loop iteration
          if (!entry.isIntersecting) continue;

          // add the class that triggers zip card animation
          zipCard.classList.add("zip-reveal-on");

          // stop observing once it has animated one time
          observer.unobserve(entry.target);

          // exit after first reveal
          break;
        }
      },
      // set how much of the zip card needs to be visible
      { threshold: 0.2, rootMargin: "0px 0px -15% 0px" }
    );

    // start observing the zip card element
    zipObs.observe(zipCard);
  }

  // - - - about page : image reveal from left - - -

  // find the about image wrapper and store in a variable
  const aboutImg = document.querySelector(".aboutImgWrap.about-img-reveal");

  // if the image wrapper exists , set up the reveal observer
  if (aboutImg) {
    // create an observer for the img reveal
    const imgObs = new IntersectionObserver(
      // runs when the image scrolls into view
      (entries, observer) => {
        // loop through observer entries
        for (const entry of entries) {
          // if image is not visible yet , skip
          if (!entry.isIntersecting) continue;

          // add the class that triggers the CSS animation
          aboutImg.classList.add("is-on");

          // stop observing after first reveal
          observer.unobserve(entry.target);

          // exit
          break;
        }
      },
      // how much of the image needs to be visible
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    // start observing the about image wrapper
    imgObs.observe(aboutImg);
  }

  // - - - about page : bio paragraph reveal from right - - -

  // find the bio paragraph wrapper and store in a variable
  const aboutBio = document.querySelector(".about-bio-reveal");

  // if that wrapper exists , set up an observer
  if (aboutBio) {
    // create an observer for the bio text
    const bioObs = new IntersectionObserver(
      // runs when the bio section scrolls into view
      (entries, observer) => {
        // loop through entries
        for (const entry of entries) {
          // if not visible , skip
          if (!entry.isIntersecting) continue;

          // add class that triggers the bio animation
          aboutBio.classList.add("is-on");

          // stop observing after first reveal
          observer.unobserve(entry.target);

          // exit
          break;
        }
      },
      // how much of the bio needs to be visible
      { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
    );

    // start observing the bio wrapper
    bioObs.observe(aboutBio);
  }
});
