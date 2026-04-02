// app.js

const API_KEY = "736ce95921a5aec9007ea48fa53cfb93";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

const form = document.getElementById("weather-form");
const cityInput = document.getElementById("city-input");
const resultCard = document.getElementById("weather-result");
const errorMessage = document.getElementById("error-message");

const cityNameEl = document.getElementById("city-name");
const countryEl = document.getElementById("country");
const tempEl = document.getElementById("temp");
const iconEl = document.getElementById("icon");
const descriptionEl = document.getElementById("description");
const detailsEl = document.getElementById("details");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    clearUI();
    setLoading(true);

    try {
        const data = await fetchWeather(city);
        renderWeather(data);
    } catch (err) {
        showError(err.message || "天気情報の取得に失敗しました。");
    } finally {
        setLoading(false);
    }
});

async function fetchWeather(city) {
    const url = `${BASE_URL}?q=${encodeURIComponent(
        city
    )},JP&appid=${API_KEY}&units=metric&lang=ja`;

    const res = await fetch(url);
    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("該当する都市が見つかりませんでした。");
        }
        throw new Error("APIエラーが発生しました。");
    }
    return res.json();
}

function renderWeather(data) {
    const {
        name,
        sys: { country },
        main: { temp, humidity, feels_like, pressure },
        weather,
        wind: { speed },
    } = data;

    const weatherInfo = weather[0];
    const iconCode = weatherInfo.icon;

    cityNameEl.textContent = name;
    countryEl.textContent = `国: ${country}`;
    tempEl.textContent = `${Math.round(temp)}℃`;
    descriptionEl.textContent = `天気: ${weatherInfo.description}`;
    detailsEl.textContent = `体感: ${Math.round(
        feels_like
    )}℃ / 湿度: ${humidity}% / 風速: ${speed} m/s / 気圧: ${pressure} hPa`;

    iconEl.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    resultCard.classList.remove("hidden");
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove("hidden");
}

function clearUI() {
    errorMessage.classList.add("hidden");
    resultCard.classList.add("hidden");
}

function setLoading(isLoading) {
    if (isLoading) {
        cityInput.disabled = true;
    } else {
        cityInput.disabled = false;
    }
}
