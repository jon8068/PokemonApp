const express = require("express");
const ejsMate = require("ejs-mate");
const axios = require("axios");
const path = require("path");
const { off } = require("process");

const app = express();
app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json())

app.get("/", async (req, res) => {
    const allPokemon = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151")
    const allPokemonSimplified = allPokemon.data.results
    res.render('landingPage', {allPokemonSimplified: allPokemonSimplified, start: 0, end: 5})
});

app.get("/pokedetails/:id", async (req, res) => {
    console.log(req.params.id);
    const allPokemon = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151");
    const allPokemonSimplified = allPokemon.data.results;
    const particularPokemon = allPokemonSimplified[req.params.id];
    const particularPokemonDetails = await axios.get(allPokemonSimplified[req.params.id].url);
    const pokemonData = particularPokemonDetails.data.abilities;
    const pokeIndex = allPokemonSimplified.indexOf(particularPokemon);
    res.render('detailsPage', {particularPokemon, pokemonData: pokemonData, pokeIndex: parseInt(pokeIndex) + 1});
})

app.get("/next", async (req, res) => {

    const allPokemon = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151")
    const allPokemonSimplified = allPokemon.data.results;

    let start;
    let end;

    if(parseInt(req.query.end) === 150){
        start = parseInt(req.query.start) + 5;
        end = parseInt(req.query.end) + 1;
        console.log("End Already")
    } else if(parseInt(req.query.end) > 150){
        start = parseInt(req.query.start);
        end = parseInt(req.query.end);
    }
    else {
        start = parseInt(req.query.start) + 5;
        end = parseInt(req.query.end) + 5;
    }

    res.render('landingPage', {allPokemonSimplified: allPokemonSimplified, start: start, end: end})
})

app.get("/prev", async (req, res) => {
    
    const allPokemon = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151")
    const allPokemonSimplified = allPokemon.data.results;

    let start;
    let end;

    if(parseInt(req.query.start) === 0){
        start = parseInt(req.query.start);
        end = parseInt(req.query.end);
    } else if(parseInt(req.query.end) > 150){
        start = parseInt(req.query.start) - 5;
        end = parseInt(req.query.end) - 1;
    } else{
        start = parseInt(req.query.start) - 5;
        end = parseInt(req.query.end) - 5;
    }

    res.render('landingPage', {allPokemonSimplified: allPokemonSimplified, start: start, end: end})
})

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
