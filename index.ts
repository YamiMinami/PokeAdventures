import express from "express";
import bodyParser from 'body-parser';
import {connect, getUsers, login, initialUser} from "./database";
import {Users} from "./interfaces";
import session from "./session";
const app = express();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(session)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async(req, res) => {
  if (req.session.username) {
    res.render("index", {user: req.session.username})
  } else {
      res.redirect("/regisratie")
  }
});

app.post("/", async(req, res) => {
  const username : string = req.body.username;
  const password : string = req.body.password;
  try {
    let user : Users = await login(username, password);
    delete user.password;
    req.session.username = user;
  } catch (e: any) {
    res.redirect("/");
  }
})
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

app.get("/guesspokemon", async(req, res) => {
    let pokemon;
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    pokemon = data;
    res.render("guesspokemon", {pokemon: pokemon});
});

app.get("/overzicht", async (req, res) => {
  let pokemons = [];
  let searchQuery: string = req.query.q ? String(req.query.q).toLowerCase() : "";

  if (searchQuery) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchQuery}`);
      if (response.ok) {
        const data = await response.json();
        pokemons.push(data);
      }
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  } else {
    for (let i = 0; i < 12; i++) {
      const randomId = Math.floor(Math.random() * 898) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      if (response.ok) {
        const data = await response.json();
        pokemons.push(data);
      }
    }
  }

  res.render('overzicht', {
    pokemons,
    q: searchQuery,
    cPokemon: pokemons[0] });
});

app.get("/tester", async (req, res) => {
  const randomId = Math.floor(Math.random() * 898) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const pokemon = await response.json();
  res.render("tester", {
    pokemon: pokemon,
  });
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

app.get('/registratie', (req, res) => {
  res.render('registratie', { error: "" });
});

app.post('/registratie', (req, res) => {
  let username: string = req.body.name;
  let password: string = req.body.password;
  let email: string = req.body.email;

  if (username === "" || email === "" || password === "") {
    res.render("registratie", { error: "All fields are required" });
  } else if (!email.includes("@")) {
    res.render("registratie", { error: "Invalid email" });
  } else {
    res.render("registratie", { error: "" });
  }
});

app.listen(app.get("port"), async () => {
  try{
    await connect();
    await initialUser()
    await getUsers();
    console.log("[server] http://localhost:" + app.get("port"))
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
    });