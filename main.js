import { APIKEY } from './apikey.js' //file was .gitignored

const getWeatherData = async(lat, lon) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKEY}`, {mode: 'cors'})
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
    
    //FL -> Feels Like
    // TODO: generate weatherData dynamically
    const weatherData = {
        currentTemp: null,
        currentFeelsLike: null,
        currentWeather: null,
        currentWeatherID: null,
    }
    
    // to add hourly weather dynamically
    for (let i = 0; i < 4; i++){
        weatherData[`hourlyTemp${i+1}`] = null;
        weatherData[`hourlyFeelsLike${i+1}`] = null;
        weatherData[`hourlyWeather${i+1}`] = null;
        weatherData[`hourlyWeatherID${i+1}`] = null;
    }

    //amend current weather data
    weatherData.currentTemp = data.current.temp;
    weatherData.currentFeelsLike = data.current.feels_like;
    weatherData.currentWeather = data.current.weather[0].main
    weatherData.currentWeatherID = data.current.weather[0].id

    //amend hourly weather data
    for (let i = 0; i < 4; i++) {
        weatherData[`hourlyTemp${i+1}`] = data.hourly[i].temp;
        weatherData[`hourlyFeelsLike${i+1}`] = data.hourly[i].feels_like;
        weatherData[`hourlyWeather${i+1}`] = data.hourly[i].weather[0].main;
        weatherData[`hourlyWeatherID${i+1}`] = data.hourly[i].weather[0].id;
    }

    console.log(weatherData)

    return weatherData
}

const APIController = async (cityName, stateCode, countryCode) => {
    const latlonData = await convertCityToLatLon(cityName, stateCode, countryCode)
    const weatherData = await convertWeatherData(latlonData.lat, latlonData.lon)
    console.log(weatherData);
}

APIController("Portland, OR")

