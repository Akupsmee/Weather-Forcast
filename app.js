const dotenv = require("dotenv").config();
const express = require("express");
const https = require("https");
const axios = require("axios")
const { Client } = require("@googlemaps/google-maps-services-js");

const app = express();
const port = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

let query = "Bremen";
const id = process.env.APP_ID;
const unit = "metric";

// let d = async()=>{
//   try {
//      const resp =  await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${id}&units=${unit}`)
//   //  return resp.data  
//   const {main}= resp.data
//   console.log(main);
    
//   } catch (error) {
//     console.log(error);
//   }
// }
// d()
// let wait = async ()=>{
//   const {main, weather} = await d()
// }

// wait()



// let weather = d.main.temp;
// let description = d.weather[0].description
// let feels = weather.feels
const client = new Client({});

app.get("/", (req, res) => {
  res.render("index", { weather, query: query, client });
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  

  const id = process.env.APP_ID;
  const unit = "metric";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${id}&units=${unit}`;

  https.get(url, (response) => {
    response.on("data", (data) => {
      d = JSON.parse(data);
      weather = {
        temperature: d.main.temp,
        description: d.weather[0].description,
        icon: d.weather[0].icon,
        lon: d.coord.lon,
        lat: d.coord.lat,
        feels: d.main.feels_like,
      };

   
      client
        .elevation({
          params: {
            locations: [{ lat: weather.lat, lng: weather.lon }],
            key: process.env.API_KEY,
          },
          timeout: 1000, // milliseconds
        })
        .then((r) => {
          console.log(r.data.results[0].elevation);
        })
        .catch((e) => {
          console.log(e.response.data.error_message);
        });

      console.log(weather.lon);
      console.log(weather.lat);

      res.render("index", { weather, query });
    });
  });
});

app.listen(port, () => {
  console.log("app listening on port 4000");
});

