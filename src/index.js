import "./style.css";

let currentUnit = 'C';
let lastFetchedData = null;

async function getWeatherData(location) {
    try {
        const response = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=XCPZDE8QNN84ZRRPQYPTLBCRH`, {mode: "cors"}
        );

        if (!response.ok) {
            throw new Error(`City '${location}' not found! Please enter an existing city.`)
        }
        
        const weatherData = await response.json();
        return weatherData;
        
    } catch (error) {
        alert(error.message);
        return null;
    }
}

function processData(rawData) {
    const myData = {
        location: rawData.resolvedAddress,
        temp: rawData.currentConditions.temp,
        conditions: rawData.currentConditions.conditions,
        description: rawData.description,
    };
    return myData;
}

const form = document.querySelector("form");
const input = document.querySelector("input");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const location = input.value;
    const weatherData = await getWeatherData(location);

    if (weatherData) {
        lastFetchedData = processData(weatherData);
        displayWeather(lastFetchedData);
    } else {
        console.log("failed to fetch the data")
    }
    
})

function displayWeather(data) {
    const currentLocation = document.querySelector(".current-location");
    const temperature = document.querySelector(".temperature");
    const conditions = document.querySelector(".conditions");
    const description = document.querySelector(".description");

    currentLocation.textContent = data.location;
    temperature.textContent = `${data.temp.toFixed(1)}°${currentUnit}`;
    conditions.textContent = data.conditions;
    description.textContent = data.description;
}

const changeTempBtn = document.querySelector("#changeTemp");
changeTempBtn.addEventListener("click", () => {
    const temperature = document.querySelector(".temperature");

    if (currentUnit === 'C') {
        lastFetchedData.temp = (lastFetchedData.temp * (9 / 5)) + 32;
        currentUnit = 'F';
        changeTempBtn.textContent = "Showing °F";
    } else {
        lastFetchedData.temp = (lastFetchedData.temp - 32) * (5 / 9);
        currentUnit = 'C';
        changeTempBtn.textContent = "Showing °C";
    }
    displayWeather(lastFetchedData);
})