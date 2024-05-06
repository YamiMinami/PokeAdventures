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
app.get("/overzicht", (req, res) => {
  res.render("overzicht");
});
app.listen(app.get("port"), () =>
    console.log("[server] http://localhost:" + app.get("port"))
);