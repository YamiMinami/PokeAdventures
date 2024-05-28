import express from "express";
const app = express();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/battle", (req, res) => {
  res.render("battle");
});
app.get("/compare", async (req, res) => {
  let pokemon1;
  let pokemon2;
  let searchQuery1 = req.query.q1 ? String(req.query.q1).toLowerCase() : "";
  let searchQuery2 = req.query.q2 ? String(req.query.q2).toLowerCase() : "";
  let pokemons = [];
  try {
    if (searchQuery1) {
      const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery1}`);
      if (response1.ok) {
        pokemon1 = await response1.json();
      }
    } else {
      const randomId1 = Math.floor(Math.random() * 898) + 1;
      const response1 = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId1}`);
      if (response1.ok) {
        pokemon1 = await response1.json();
      }
    }
    if (searchQuery2) {
      const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery2}`);
      if (response2.ok) {
        pokemon2 = await response2.json();
      }
    } else {
      const randomId2 = Math.floor(Math.random() * 898) + 1;
      const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId2}`);
      if (response2.ok) {
        pokemon2 = await response2.json();
      }
    }
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }

  for (let i = 0; i < 12; i++) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    pokemons.push(data);
  };

  const currentPokemon = pokemons[1];
  res.render('compare', {
    pokemon1,
    pokemon2,
    q1: searchQuery1,
    q2: searchQuery2,
    cPokemon: currentPokemon

  });
});



app.get("/guesspokemon", async(req, res) => {
  let pokemon;
  const randomId = Math.floor(Math.random() * 898) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await response.json();
  let pokemons = [];
  pokemon = data;

  for (let i = 0; i < 12; i++) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    pokemons.push(data);
  };

  const currentPokemon = pokemons[1];
  res.render("guesspokemon", {pokemon: pokemon,
    cPokemon: currentPokemon

  });
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

app.get("/detail/:id", async (req, res) => {
  const pokemonId = req.params.id;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data = await response.json();
  const pokemon = data;
  let pokemons = [];
  for (let i = 0; i < 12; i++) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    pokemons.push(data);
  };

  const currentPokemon = pokemons[1];
  const speciesResponse = await fetch(pokemon.species.url);
  const species = await speciesResponse.json();

  const evolutionResponse = await fetch(species.evolution_chain.url);
  const evolutionChain = await evolutionResponse.json();
  res.render("detail", {
    pokemon: pokemon,
    cPokemon: currentPokemon,
    evolutionChain: evolutionChain
  });
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);