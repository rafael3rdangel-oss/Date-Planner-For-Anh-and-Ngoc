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
    fs.writeFileSync(DB_FILE, JSON.stringify({ planner: [] }, null, 2));
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = raw ? JSON.parse(raw) : { planner: [] };

    if (!Array.isArray(parsed.planner)) {
      parsed.planner = [];
    }

    return parsed;
  } catch (error) {
    console.error("Could not read db.json:", error);
    return { planner: [] };
  }
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get("/api/planner", (req, res) => {
  const db = loadDB();
  const selectedDate = req.query.date;

  let activities = db.planner;

  if (selectedDate) {
    activities = activities.filter(item => item.date === selectedDate);
  }

  activities.sort((a, b) => {
    const dateCompare = String(a.date || "").localeCompare(String(b.date || ""));
    if (dateCompare !== 0) return dateCompare;
    return String(a.created || "").localeCompare(String(b.created || ""));
  });

  res.json(activities);
});

app.post("/api/planner", (req, res) => {
  const { text, time, date } = req.body;

  if (!text || !time || !date) {
    return res.status(400).json({
      error: "Text, time and date are required."
    });
  }

  const db = loadDB();

  const newActivity = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    text: String(text).trim(),
    time: String(time),
    date: String(date),
    completed: false,
    rating: 0,
    created: new Date().toISOString()
  };

  db.planner.push(newActivity);
  saveDB(db);

  res.status(201).json(newActivity);
});

app.patch("/api/planner/:id", (req, res) => {
  const db = loadDB();
  const activity = db.planner.find(item => String(item.id) === req.params.id);

  if (!activity) {
    return res.status(404).json({ error: "Activity not found." });
  }

  if (typeof req.body.text === "string" && req.body.text.trim()) {
    activity.text = req.body.text.trim();
  }

  if (typeof req.body.time === "string") {
    activity.time = req.body.time;
  }

  if (typeof req.body.date === "string") {
    activity.date = req.body.date;
  }

  if (typeof req.body.completed === "boolean") {
    activity.completed = req.body.completed;
  }

  if (req.body.rating !== undefined) {
    const rating = Number(req.body.rating);

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({
        error: "Rating must be a whole number from 0 to 5."
      });
    }

    activity.rating = rating;
  }

  activity.updated = new Date().toISOString();
  saveDB(db);

  res.json(activity);
});

app.delete("/api/planner/:id", (req, res) => {
  const db = loadDB();
  const previousLength = db.planner.length;

  db.planner = db.planner.filter(item => String(item.id) !== req.params.id);

  if (db.planner.length === previousLength) {
    return res.status(404).json({ error: "Activity not found." });
  }

  saveDB(db);
  res.json({ success: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Date Planner is running on port ${PORT}`);
});
