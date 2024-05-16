import express from "express";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
const app = express();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static("public"));

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://estalistrinev:tPqvaqEIdP7z9KM1@mijnproject.udzcq5y.mongodb.net/?retryWrites=true&w=majority&appName=mijnProject', {
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/battle", async (req, res) => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await response.json();

  res.render("battle", {
    pokemon: pokemon,
  });
});
app.get("/compare", (req, res) => {
  res.render("compare");
});

app.get("/guesspokemon", (req, res) => {
  res.render("guesspokemon");
});
app.get("/inlog", (req, res) => {
  res.render("inlog");
});
app.get("/overzicht", async (req, res) => {
  let pokemons = [];

  for (let i = 0; i < 12; i++) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    pokemons.push(data);
  };

  const currentPokemon = pokemons[1];

  res.render("overzicht", {
    pokemons: pokemons,
    cPokemon: currentPokemon
  });
});

app.get("/tester", (req, res) => {
  res.render("tester");
});
app.get("/teamplanner", (req, res) => {
  res.render("teamplanner");
});

app.get("/menu", (req, res) => {
  res.render("menu");
});

app.get("/detail/:id", async (req, res) => {
  const pokemonId = req.params.id;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data = await response.json();
  const pokemon = data;
  res.render("detail", {
    pokemon: pokemon
  });
});

app.listen(app.get("port"), () =>
    console.log("[server] http://localhost:" + app.get("port"))
);