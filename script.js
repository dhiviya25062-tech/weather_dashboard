const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const weatherDescription = document.getElementById("weatherDescription");

const errorMessage = document.getElementById("errorMessage");
const loadingMessage = document.getElementById("loadingMessage");


// Search weather
searchBtn.addEventListener("click", getWeather);


// Allow Enter key
cityInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});


// Main weather function
async function getWeather() {

    const city = cityInput.value.trim();

    if (city === "") {

        errorMessage.textContent = "Please enter a city name.";

        return;
    }


    errorMessage.textContent = "";

    loadingMessage.textContent = "Loading weather...";


    try {

        // Get city coordinates
        const locationResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );


        if (!locationResponse.ok) {

            throw new Error("Unable to find the city.");

        }


        const locationData = await locationResponse.json();


        if (!locationData.results || locationData.results.length === 0) {

            throw new Error("City not found. Please check the city name.");

        }


        const location = locationData.results[0];


        // Get weather data
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`
        );


        if (!weatherResponse.ok) {

            throw new Error("Unable to fetch weather data.");

        }


        const weatherData = await weatherResponse.json();


        // Display city
        cityName.textContent =
            `${location.name}, ${location.country}`;


        // Display temperature
        temperature.textContent =
            `${weatherData.current.temperature_2m} °C`;


        // Display humidity
        humidity.textContent =
            `${weatherData.current.relative_humidity_2m}%`;


        // Display wind speed
        windSpeed.textContent =
            `${weatherData.current.wind_speed_10m} km/h`;


        // Display weather condition
        weatherDescription.textContent =
            getWeatherDescription(weatherData.current.weather_code);


        loadingMessage.textContent = "";


    } catch (error) {

        console.error(error);

        errorMessage.textContent =
            error.message || "Something went wrong.";

        loadingMessage.textContent = "";

    }

}


// Convert weather code to description
function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (code === 1 || code === 2 || code === 3) {
        return "Partly Cloudy";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain Showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown";
}