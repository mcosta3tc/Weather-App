// Tutorial http://youtube.com/CodeExplained
// api key : dccbb314d261fe4966f7bff877628594

//Sélection des éléments
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

//APP Data
//Objet weather qui se remplira avec notre api
const weather = {};

//Définition de l'unité de mesure
weather.temperature = {
    unit: 'celsius'
}

//Variables de l'APP
//Variable pour convertir dans la bonne unité ( x - 273 )
const KELVIN = 273;
//Clé d'identification pour l'API
const key = 'dccbb314d261fe4966f7bff877628594';

//Tester sur le navigateur support la localisation
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = '<p>Votre navigateur ne supporte pas la géolocalisation</p>';
}

//Définir la position de l'utilisateur grâce à l'objet position du navigateur
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
}

//Montrer le message d'erreur en cas de problème de géolocalisation avec l'objet error du navigateur
function showError(error) {
    notificationElement.style.display = 'block';
    notificationElement.innerHTML = `<p>${error.message = 'Géolocalisation refusé par l\'utilisateur'}</p>`
}

//Récupérer les information depuis l'API notamment pour la fonction getWeather(latitude, longitude)
function getWeather(latitude, longitude, city) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`; // l'URL de l'API avec nos informations récupérer

    fetch(api)
        .then(function (response) {
            //réponse convertie en JSON
            let data = response.json();
            console.log(data);
            return data;
        })
        //MAJ de notre objet avec les information récupérer par la réponse (data)
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country;
        })
        .then(() => {
            //Appel de la fonction pour maj l'affichage
            displayWeather();
        });
}

//Afficher toutes les informations récupérer
function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png" alt="cloud">`;
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

//Convertir de C° à F°
function celsiusToFahrenheit(temperature) {
    return Math.floor((temperature * 9 / 5) + 32);
}

//Conversion au clique sur la température
tempElement.addEventListener("click", () => {
    if (weather.temperature.unit === undefined) return;
    if (weather.temperature.unit === "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    } else {
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius";
    }
})

