const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = "db.json";

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(
      DB_FILE,
      JSON.stringify({ planner: [] }, null, 2)
    );
  }

  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveDB(data) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(data, null, 2)
  );
}

/* Get activities for one date */
app.get("/api/planner", (req, res) => {
  const db = loadDB();
  const selectedDate = req.query.date;

  if (!selectedDate) {
    return res.json(db.planner);
  }

  const activities = db.planner.filter(item => {
    return item.date === selectedDate;
  });

  res.json(activities);
});

/* Add an activity */
app.post("/api/planner", (req, res) => {
  const { text, time, date } = req.body;

  if (!text || !time || !date) {
    return res.status(400).json({
      error: "Text, time and date are required."
    });
  }

  const db = loadDB();

  const newActivity = {
    id: Date.now(),
    text,
    time,
    date,
    created: new Date().toISOString()
  };

  db.planner.push(newActivity);
  saveDB(db);

  res.json(newActivity);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Date Planner is running on port", PORT);
});
