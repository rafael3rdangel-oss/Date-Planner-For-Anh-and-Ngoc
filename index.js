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
