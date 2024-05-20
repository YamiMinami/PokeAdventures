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
app.get("/compare", (req, res) => {
  res.render("compare");
});

app.get("/guesspokemon", async(req, res) => {
  let pokemon;
  const randomId = Math.floor(Math.random() * 898) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await response.json();
  pokemon = data;
  res.render("guesspokemon", {pokemon: pokemon});
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
  // Voor matthew
  /*const responseEvo = await fetch('https://pokeapi.co/api/v2/evolution-chain/${pokemonId}')
  const dataEvo = await responseEvo.json();
  const evolutions = dataEvo;*/
  res.render("detail", {
    pokemon: pokemon
    //evolutions: evolutions
  });
});

app.listen(app.get("port"), () =>
  console.log("[server] http://localhost:" + app.get("port"))
);