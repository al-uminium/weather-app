import { APIKEY } from './apikey.js' //file was .gitignored

const getWeatherData = async(lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${APIKEY}`, {mode: 'cors'})
    const data = await response.json()
    return data
}

const getLatAndLon = async(cityName, stateCode=undefined, countryCode=undefined) => {
    let response;

    if (stateCode==undefined) {
        response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryCode}&appid=${APIKEY}`, {mode: 'cors'})
    } else if (countryCode==undefined) {
        response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode}&appid=${APIKEY}`, {mode: 'cors'})
    } else {
        response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&appid=${APIKEY}`, {mode: 'cors'})
    }

    const data = await response.json()
    return data
}

const convertCityToLatLon = async (cityName, stateCode, countryCode) => {
    const data = await getLatAndLon(cityName, stateCode, countryCode)
    console.log("city to latlon")
    console.log(data[0].lat)
    console.log(data[0].lon)
    const lat = data[0].lat;
    const lon = data[0].lon;

    return {lat, lon};
}

const convertWeatherData = async(lat, lon) => {
    const data = await getWeatherData(lat, lon)
    console.log(data)
    
    //FL -> Feels Like
    // TODO: generate weatherData dynamically
    const weatherData = {
        currentTemp: null,
        currentFeelsLike: null,
        currentWeather: null,
        currentWeatherID: null,
        currentWeatherIcon: null,
    }
    
    // to add hourly weather dynamically
    for (let i = 0; i < 4; i++){
        weatherData[`hourlyTemp${i+1}`] = null;
        weatherData[`hourlyFeelsLike${i+1}`] = null;
        weatherData[`hourlyWeather${i+1}`] = null;
        weatherData[`hourlyWeatherID${i+1}`] = null;
        weatherData[`hourlyWeatherIcon${i+1}`] = null;
    }

    //amend current weather data
    weatherData.currentTemp = Number.parseFloat(data.current.temp).toFixed(1);
    weatherData.currentFeelsLike = Number.parseFloat(data.current.feels_like).toFixed(1);
    weatherData.currentWeather = data.current.weather[0].main;
    weatherData.currentWeatherID = data.current.weather[0].id;
    weatherData.currentWeatherIcon = data.current.weather[0].icon;

    //amend hourly weather data
    for (let i = 0; i < 4; i++) {
        weatherData[`hourlyTemp${i+1}`] = Number.parseFloat(data.hourly[i].temp).toFixed(1);
        weatherData[`hourlyFeelsLike${i+1}`] = Number.parseFloat(data.hourly[i].feels_like).toFixed(1);
        weatherData[`hourlyWeather${i+1}`] = data.hourly[i].weather[0].main;
        weatherData[`hourlyWeatherID${i+1}`] = data.hourly[i].weather[0].id;
        weatherData[`hourlyWeatherIcon${i+1}`] = data.hourly[i].weather[0].icon;
    }

    console.log(weatherData)

    return weatherData
}

const APIController = async (cityName, stateCode, countryCode) => {
    const latlonData = await convertCityToLatLon(cityName, stateCode, countryCode)
    const weatherData = await convertWeatherData(latlonData.lat, latlonData.lon)
    console.log(weatherData);

    //Update current weather
    await DisplayController.updateCurrentWeatherIcon(weatherData.currentWeatherIcon);
    await DisplayController.updateCurrentWeatherAndUmbrellaStatus(weatherData.currentWeather);
    await DisplayController.updateCurrentTemperature(weatherData.currentTemp);
    await DisplayController.updateCurrentFeelsLike(weatherData.currentFeelsLike);
}

const DisplayController = (() => {
    // Current weather info
    const umbrellaStatus = document.querySelector(".umbrella-status");
    const weatherStatus = document.querySelector(".weather-status");
    const currentTemp = document.querySelector(".current-temp");
    const currentIcon = document.querySelector(".current-icon")
    const feelsLike = document.querySelector(".feels-like")

    const updateCurrentWeatherAndUmbrellaStatus = (currentWeatherStatus) => {
        // TODO - add in night variants for background.  
        switch (currentWeatherStatus) {
            case "Thunderstorm":
                weatherStatus.innerText = "It's storming out there."
                umbrellaStatus.innerText = "You definitely need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/thunderstorm.jpg')"
            case "Drizzle":
                weatherStatus.innerText = "It's drizzling."
                umbrellaStatus.innerText = "You need an umbrella ☂️"
                document.body.style.backgroundImage = "url('./background-img/drizzle.jpg')"
            case "Rain":
                weatherStatus.innerText = "It's raining!"
                umbrellaStatus.innerText = "You need an umbrella ☔️"
                document.body.style.backgroundImage = "url('./background-img/rain.jpg')"
            case "Snow":
                weatherStatus.innerText = "It's snowing!"
                umbrellaStatus.innerHTML = "You need an umbrella, and a jacket to keep warm! 🌨"
                document.body.style.backgroundImage = "url('./background-img/snow.jpg')"
            case "Mist":
                weatherStatus.innerText = "It's misty."
                umbrellaStatus.innerText = "You don't need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/atmosphere_mist.jpg')"
            case "Smoke":
                weatherStatus.innerText = "The air's smoky out there"
                umbrellaStatus.innerText = "You don't need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/atmosphere_Smoke.jpg')"
            case "Haze":
                weatherStatus.innerText = "It's kinda hazy on the horizon..."
                umbrellaStatus.innerText = "You don't need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/atmosphere_haze.jpg')"
            case "Dust":
                weatherStatus.innerText = "The winds are whipping up the dust!"
                umbrellaStatus.innerText = "You don't need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/atmosphere_dust.jpg')"
            case "Fog":
                weatherStatus.innerText = "Fog is encroaching the area"
                umbrellaStatus.innerText = "You don't need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/atmosphere_fog.jpg')"
            case "Sand":
                weatherStatus.innerText = "The winds are whipping up the sand!"
                umbrellaStatus.innerText = "You don't need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/atmosphere_dust.jpg')"
            case "Ash":
                weatherStatus.innerText = "Ashes from the mountain is trickling down"
                umbrellaStatus.innerText = "An umbrella might help."
                document.body.style.backgroundImage = "url('./background-img/atmosphere_ash.jpg')"
            case "Squall":
                weatherStatus.innerText = "There's a squall in the area!"
                umbrellaStatus.innerText = "You need an umbrella, if you're heading out!"
                document.body.style.backgroundImage = "url('./background-img/atmosphere_squall.jpg')"
            case "Tornado":
                weatherStatus.innerText = "There's a torndao in the area!"
                umbrellaStatus.innerText = "You need an umbrella, if you're heading out!"
                document.body.style.backgroundImage = "url('./background-img/atmosphere_tornado.jpg')"
            case "Clear":
                weatherStatus.innerText = "The skies are clear."
                umbrellaStatus.innerText = "You don't need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/clear.jpg')"
            case "Clouds":
                weatherStatus.innerText = "The skies are cloudy."
                umbrellaStatus.innerText = "You might need an umbrella"
                document.body.style.backgroundImage = "url('./background-img/clouds.jpg')"
        }
    }

    const updateCurrentWeatherIcon = (weatherIcon) => {
        currentIcon.src = `http://openweathermap.org/img/wn/${weatherIcon}.png`
    }

    const updateCurrentTemperature = (currentTemperature) => {
        currentTemp.innerText = `${currentTemperature}°C`
    }

    const updateCurrentFeelsLike = (currFeelsLike) => {
        feelsLike.innerText = `${currFeelsLike}°C`
    }

    return {
        updateCurrentWeatherAndUmbrellaStatus, 
        updateCurrentWeatherIcon,
        updateCurrentTemperature,
        updateCurrentFeelsLike,
    }
})()

APIController("Portland, OR")

