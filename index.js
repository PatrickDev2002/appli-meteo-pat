const meteoIcons = {
  Rain: "wi wi-day-rain",
  Clouds: "wi wi-day-cloudy",
  Clear: "wi wi-day-sunny",
  Snow: "wi wi-day-snow",
  mist: "wi wi-day-fog",
  Drizzle: "wi wi-day-sleet",
};

const CLE_API = "dd9735fc71d6e832ecb12980ef6bb3de";

previsionContent = document.getElementById("affichageParJour");

previsionContentHeure = document.getElementById("affichageParHeure");

main();

let button = document.querySelector("#changer");
button.addEventListener("click", () => {
  ville = prompt("Choisissez une ville :");
  main(ville);
});

async function main(paramVille) {
  let ville = "";
  if (paramVille) {
    ville = paramVille;
  } else {
    ville = "Paris";
  }
  document.body.style.backgroundImage =
    "url('https://source.unsplash.com/1650x950/?" + ville + "')";
  //Recup la meteo en fonction de la ville
  let urlAjd = `https://api.openweathermap.org/data/2.5/weather?q=${ville}&appid=${CLE_API}&lang=fr&units=metric`;
  const meteo = await fetch(urlAjd)
    .then((resultat) => resultat.json())
    .then((json) => json);

  recevoirTemperature(meteo);
  previsionParJour(ville);
  //previsionParHeure(ville);
  console.log(meteo);
}

function recevoirTemperature(data) {
  if (data.cod == 200) {
    const ville = data.name;
    const temperature = data.main.temp;
    const conditions = data.weather[0].main;
    const description = data.weather[0].description;

    document.querySelector("#ville").textContent = ville;
    document.querySelector("#temperature_label").textContent =
      temperature + " °C";
    document.querySelector("#condition").textContent = capitalize(description);
    document.querySelector("i.wi").className = meteoIcons[conditions];
  } else {
    alert("Un problème est intervenu, merci de revenir plus tard.");
  }
}

async function previsionParJour(ville) {
  let urlHeure = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${CLE_API}&lang=fr&units=metric`;
  const previsions = await fetch(urlHeure)
    .then((resultat) => resultat.json())
    .then((json) => {
      const previsionData = json.list.filter((obj) =>
        obj.dt_txt.endsWith("12:00:00")
      );
      const previsionHeure = json.list;
      afficherPrevisionHeure(previsionHeure);
      afficherPrevisionJour(previsionData);
    });

  console.log(previsions);
}

async function previsionParHeure(ville) {
  let urlHeure = `https://api.openweathermap.org/data/2.5/forecast?q=${ville}&appid=${CLE_API}&lang=fr&units=metric`;
  const previsionAjd = fetch(urlHeure)
    .then((resultat) => resultat.json())
    .then((json) => {
      const previsionHeure = json.list;
      afficherPrevisionHeure(previsionHeure);
    });
  console.log(previsionAjd);
}

function afficherPrevisionHeure(prevision) {
  removeChildren(previsionContentHeure);
  const today = new Date();
  prevision.forEach((item) => {
    const forecastDate = new Date(item.dt * 1000);
    if (forecastDate.getDate() === today.getDate()) {
      const meteoData = `<div class="prevision-heure">
      <p class="hour">Heure : ${forecastDate.getHours()}h00</p>
      <p class="temp">Température : ${item.main.temp} °C</p>
      <p class="desc">Description : ${capitalize(
        item.weather[0].description
      )}</p>
      </div>`;
      previsionContentHeure.insertAdjacentHTML("beforeend", meteoData);
    } else if (forecastDate.getDate() === today.getDate() + 1) {
      const meteoData = `<div class="prevision-heure">
      <p class="hour">Heure : ${forecastDate.getHours()}h00</p>
      <p class="temp">Température : ${item.main.temp} °C</p>
      <p class="desc">Description : ${capitalize(
        item.weather[0].description
      )}</p>
      </div>`;
      previsionContentHeure.insertAdjacentHTML("beforeend", meteoData);
    }
    // if (previsionContentHeure.innerHTML === '')
  });
}

function afficherPrevisionJour(prevision) {
  removeChildren(previsionContent);
  prevision.forEach((weatherData) => {
    const conditions = weatherData.weather[0].main;
    console.log(weatherData);
    const meteoData = `<div class="prevision-jour">
     <h3 class="prevision-date">${capitalize(
       convJour(new Date(weatherData.dt * 1000))
     )}</h3>
     <p class="prevision-temperature">${Math.floor(
       weatherData.main.temp
     )} °C</p>
     <i class="${meteoIcons[conditions]}" style="color: antiquewhite"></i>
     <p class="prevision-description">${capitalize(
       weatherData.weather[0].description
     )}</p>
   </div>`;
    previsionContent.insertAdjacentHTML("beforeend", meteoData);
  });
}

function convJour(date) {
  const options = { weekday: "long" };
  return date.toLocaleString("fr-fr", options);
}

function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}

function removeChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
