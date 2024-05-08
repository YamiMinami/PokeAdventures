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
app.get("/detail", (req, res) => {
  res.render("detail");
});
app.get("/guesspokemon", (req, res) => {
  res.render("guesspokemon");
});
app.get("/inlog", (req, res) => {
  res.render("inlog");
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


const usersFilePath = "login.json";
import fs from "fs";


const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));


app.post("/inlog", (req, res) => {

  const user = users.find((user: any) => user.username === uname && user.password === pword);


  let uname :string = req.body.uname;
  let pword :string = req.body.pword;

  if (uname === "gebruiker1" || pword === "wachtwoord1") {
    res.render("inlog", { error: "Succesvol ingelogd." });
  } 
  else {
    res.render("inlog", { error: "Ongeldige gebruikersnaam of wachtwoord." });
  }

});


app.get("/overzicht", (req, res) => {
  res.render("overzicht");
});
app.get("/tester", (req, res) => {
  res.render("tester");
});
app.get("/teamplanner", (req, res) => {
  res.render("teamplanner");
});
app.listen(app.get("port"), () =>
    console.log("[server] http://localhost:" + app.get("port"))
);