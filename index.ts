import express from "express";
import {connect, getUsers, login, initialUser, userCollection, registerUser} from "./database";
import {Users} from "./interfaces";
import session from "./session";
import {secureMiddleware} from "./secureMiddleware";
import { Pokemon, Stat } from "./interfaces"; // Import the types
import bodyParser from "body-parser";
import { ObjectId} from "mongodb";

const app = express();
app.set("view engine", "ejs");
app.set("port", 3000);
app.use(session)
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies (optional if you're not sending JSON)

app.get("/", (req, res) => {
    res.render("index", );
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", async (req, res) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  try {
    let user: Users = await login(username, password);
    delete user.password;
    req.session.username = user;

    if (user.currentPokemon) {
      res.redirect("/menu");
    } else {
      res.redirect("/tester");
    }
  } catch (e: any) {
    res.redirect("/login");
  }
});

app.get("/battle", secureMiddleware, async (req, res) => {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await response.json();
    
    const user = req.session.username as Users;
    const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${user.currentPokemon}`);
    const currentPokemon: Pokemon = await currentResponse.json();
  res.render("battle", {
    pokemon: pokemon,
    cPokemon: currentPokemon
  });
});
app.get("/compare", async (req, res) => {
  let pokemon1;
  let pokemon2;
  let searchQuery1 = req.query.q1 ? String(req.query.q1).toLowerCase() : "";
  let searchQuery2 = req.query.q2 ? String(req.query.q2).toLowerCase() : "";
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
  const user = req.session.username as Users;
  const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${user.currentPokemon}`);
  const currentPokemon: Pokemon = await currentResponse.json();

  res.render('compare', {
    pokemon1,
    pokemon2,
    q1: searchQuery1,
    q2: searchQuery2,
    cPokemon: currentPokemon

  });
});

app.get("/guesspokemon", secureMiddleware, async (req, res) => {
  try {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon: Pokemon = await response.json();

    const user = req.session.username as Users;
    const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${user.currentPokemon}`);
    const currentPokemon: Pokemon = await currentResponse.json();

    res.render("guesspokemon", {
      pokemon: pokemon,
      cPokemon: currentPokemon,
      guessedCorrectly: null
    });
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/guesspokemon", secureMiddleware, async (req, res) => {
  try {
    const guessedName = req.body.pokemonName.toLowerCase();
    const pokemonId = req.body.pokemonId;


    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemon: Pokemon = await response.json();

    const user = req.session.username as Users;
    const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${user.currentPokemon}`);
    const currentPokemon: Pokemon = await currentResponse.json();

    let guessedCorrectly = false;
    if (guessedName === pokemon.name) {
      const hpStat = currentPokemon.stats.find((stat: Stat) => stat.stat.name === "hp");
      if (hpStat) {
        hpStat.base_stat += 1;
      }
      guessedCorrectly = true;
    }
    res.render("guesspokemon", {
      pokemon: pokemon,
      cPokemon: currentPokemon,
      guessedCorrectly: guessedCorrectly
    });
  } catch (error) {
    console.error("Error handling guess:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/overzicht", secureMiddleware, async (req, res) => {
  let pokemons = [];
  let searchQuery: string = req.query.q ? String(req.query.q).toLowerCase() : "";
  const user = req.session.username as Users;
  const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${user.currentPokemon}`);
  const currentPokemon: Pokemon = await currentResponse.json();

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
    cPokemon: pokemons[0],
    currentPokemon: currentPokemon});
});

app.get("/tester", secureMiddleware, async (req, res) => {
  if (req.session.username) {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = await response.json();
    res.render("tester", {
      user: req.session.username,
      pokemon
    });
  } else {
    res.redirect("/");
  }
});

app.post('/tester', secureMiddleware, async (req, res) => {
  const pokemonId = parseInt(req.body.pokemonId, 10);
  const username = req.session.username;

  if (!username) {
    return res.redirect("/login");
  }

  try {
    const user = await userCollection.findOne({ username: username.username });
    if (user) {
      const updatedOwnedPokemons = user.ownedPokemons ? [...user.ownedPokemons, pokemonId] : [pokemonId];
      await userCollection.updateOne(
          { _id: new ObjectId(user._id) },
          { $set: { currentPokemon: pokemonId, ownedPokemons: updatedOwnedPokemons } }
      );
      res.redirect("/overzicht");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.error("Error catching Pokémon:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/teamplanner", secureMiddleware, async (req, res) => {
  const user = req.session.username as Users;

  const currentPokemonName = user.currentPokemon ;
  const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentPokemonName}`);
  const currentPokemon: Pokemon = await currentResponse.json();

  const speciesResponse = await fetch(currentPokemon.species.url);
  const species = await speciesResponse.json();
  const evolutionResponse = await fetch(species.evolution_chain.url);
  const evolutionChain = await evolutionResponse.json();

  const ownedPokemonDetails = await Promise.all(
      (user.ownedPokemons || []).map(async (id) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return await response.json();
      })
  );

  res.render('teamplanner', {
    cPokemon: currentPokemon,
    ownedPokemonDetails,
    evolutionChain
  });
});

app.post("/teamplanner/select", secureMiddleware, async (req, res) => {
  const user = req.session.username as Users;
  const selectedPokemonId = parseInt(req.body.selectedPokemon);

  await userCollection.updateOne(
      { username: user.username },
      { $set: { currentPokemon: selectedPokemonId } }
  );

  user.currentPokemon = selectedPokemonId;
  const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemonId}`);
  const currentPokemon: Pokemon = await currentResponse.json();

  const speciesResponse = await fetch(currentPokemon.species.url);
  const species = await speciesResponse.json();
  const evolutionResponse = await fetch(species.evolution_chain.url);
  const evolutionChain = await evolutionResponse.json();

  const ownedPokemonDetails = await Promise.all(
      (user.ownedPokemons || []).map(async (id) => {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        return await response.json();
      })
  );

  res.render('teamplanner', {
    cPokemon: currentPokemon,
    ownedPokemonDetails,
    evolutionChain
  });
});


app.get("/menu", secureMiddleware, async(req, res) => {
  const user = req.session.username as Users;
  const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${user.currentPokemon}`);
  const currentPokemon: Pokemon = await currentResponse.json();
  res.render("menu", {
    cPokemon: currentPokemon
  });
});

app.get("/detail/:id", secureMiddleware, async (req, res) => {
  const pokemonId = req.params.id;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  const data = await response.json();
  const pokemon = data;

  const user = req.session.username as Users;
  const currentResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${user.currentPokemon}`);
  const currentPokemon: Pokemon = await currentResponse.json();
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

app.get('/registratie', (req, res) => {
  res.render('registratie', { error: "" });
});

app.post('/registratie', async(req, res) => {
  let username: string = req.body.username;
  let password: string = req.body.password;


  if (username === "" || password === "") {
    res.render("registratie", { error: "All fields are required" });
  } else {
    try {
      await registerUser(username, password);
      res.redirect("/login");
    } catch (error: any) {
      if (error.message === "Username already exists") {
        res.render("registratie", { error: "Username already exists" });
      } else {
        res.render("registratie", { error: "Error registering user" });
      }
    }
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