const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// THIS IS THE FIX 👇
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

let planner = [];
let food = [];
let games = [];
let notes = [];
let places = [];

app.get("/food", (req, res) => res.json(food));
app.post("/food", (req, res) => {
  food.push(req.body);
  res.json({ ok: true });
});

app.get("/games", (req, res) => res.json(games));
app.post("/games", (req, res) => {
  games.push(req.body);
  res.json({ ok: true });
});

app.get("/notes", (req, res) => res.json(notes));
app.post("/notes", (req, res) => {
  notes.push(req.body);
  res.json({ ok: true });
});

app.get("/places", (req, res) => res.json(places));
app.post("/places", (req, res) => {
  places.push(req.body);
  res.json({ ok: true });
});

app.get("/api/planner", (req, res) => {
  res.json(planner);
});

app.post("/api/planner", (req, res) => {
  planner.push(req.body);
  res.json({ ok: true });
});

// THIS MAKES / OPEN YOUR WEBSITE 👇
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Date Planner running on", PORT);
});
