"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

const renderCountry = function (data, className = "") {
  const html = `
        <article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
        <h3 class="country__name">${data.name}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>Population: ${(
          +data.population / 1000000
        ).toFixed()}M</p>
        <p class="country__row"><span>🗣️</span>Language: ${
          data.languages[0].name
        }</p>
        <p class="country__row"><span>💰</span>Currency: ${
          data.currencies[0].name
        }</p>
        </div>
        </article>
        `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (message) {
  // countriesContainer.style.opacity = 1;
  countriesContainer.insertAdjacentText("beforeend", message);
  countriesContainer.style.display = "flex";
  let myElement = document.querySelector(".countries");
  myElement.style.textAlign = "center";
  myElement.style.margin = "2rem";
};

//////////////////////////////////////////////////////////////////

let controller = new AbortController();

// Reusable function

const getJSOn = function (url, err = "Something went wrong") {
  return fetch(url, {
    signal: controller.signal,
  }).then((response) => {
    // Checking response
    if (!response.ok) throw new Error(`${err} (${response.status} error)`);

    return response.json();
  });

  // Error message
};

////////////////////////////////////////////////////////////////////

const getCountryData = function (country) {
  // Main country

  getJSOn(`https://restcountries.com/v2/name/${country}`, "Country not found")
    .then((data) => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[1];

      if (!neighbour) throw new Error(`No neighbour found`);

      // Neighbour country
      return getJSOn(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        "Country not found"
      );
    })
    .then((data) => renderCountry(data, "neighbour"))
    .catch((err) => {
      console.error(`${err} ⚠️⚠️⚠️`);
      if (err.name == "AbortError") alert("Aborted!");
      renderError(
        `Something went wrong ⚠️⚠️⚠️ ${err.message} Please Try again!`
      );
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener(
  "click",
  function () {
    getCountryData("iran");
  },
  { once: true }
);

module.exports = renderCountry;
module.exports = renderError;
module.exports = getJSOn;
module.exports = getCountryData;
