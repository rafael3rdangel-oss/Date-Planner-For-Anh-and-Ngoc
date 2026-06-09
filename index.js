const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const DB_FILE = "db.json";

// helper functions
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({ planner: [] }));
  }
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// homepage
app.get("/", (req, res) => {
  res.send("Date Planner running 💖");
});

// get planner
app.get("/api/planner", (req, res) => {
  const db = loadDB();
  res.json(db.planner);
});

// add planner item
app.post("/api/planner", (req, res) => {
  const db = loadDB();

  db.planner.push({
    text: req.body.text,
    time: "Morning",
    created: new Date()
  });

  saveDB(db);
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Running on", PORT);
});
