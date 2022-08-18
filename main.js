import { APIKEY } from './apikey.js' //file was .gitignored

// fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=${APIKEY}`, {mode: 'cors'})
//     .then((response) => {
//         console.log(response.json())
// })

const getWeatherData = async() => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&appid=${APIKEY}`, {mode: 'cors'})
    const data = await response.json()
    return data
}

const getLatAndLon = async(cityName, stateCode, countryCode, limit) => {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${APIKEY}`, {mode: 'cors'})
    const data = await response.json()
    return data
}

const test = async() => {
    const cityName = "Portland"
    const stateCode = "Maine"
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode}&appid=${APIKEY}`, {mode: 'cors'})
    const data = await response.json()
    console.log(data)
}

test()

const convertWeatherData = async() => {
    const data = await getWeatherData()
    
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

// let x = convertWeatherData()

// let cityQuery = "Punkeydoodles Corners"

// fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityQuery}&limit=5&appid=${APIKEY}`, {mode: 'cors'})
//     .then((response) => {
//         console.log(response.json())
// })