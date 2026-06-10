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

  try {
    const content = fs.readFileSync(DB_FILE, "utf8");

    return content
      ? JSON.parse(content)
      : { planner: [] };
  } catch (error) {
    console.error("Could not read database:", error);
    return { planner: [] };
  }
}

function saveDB(data) {
  fs.writeFileSync(
    DB_FILE,
    JSON.stringify(data, null, 2)
  );
}

/* Get activities */
app.get("/api/planner", (req, res) => {
  const db = loadDB();
  const selectedDate = req.query.date;

  let activities = db.planner;

  if (selectedDate) {
    activities = activities.filter(item => {
      return item.date === selectedDate;
    });
  }

  activities.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  res.json(activities);
});

/* Add activity */
app.post("/api/planner", (req, res) => {
  const { text, time, date } = req.body;

  if (!text || !time || !date) {
    return res.status(400).json({
      error: "Text, time and date are required."
    });
  }

  const db = loadDB();

  const newActivity = {
    id: Date.now().toString(),
    text: text.trim(),
    time,
    date,
    completed: false,
    created: new Date().toISOString()
  };

  db.planner.push(newActivity);
  saveDB(db);

  res.status(201).json(newActivity);
});

/* Edit activity */
app.patch("/api/planner/:id", (req, res) => {
  const db = loadDB();

  const activity = db.planner.find(item => {
    return item.id === req.params.id;
  });

  if (!activity) {
    return res.status(404).json({
      error: "Activity not found."
    });
  }

  if (typeof req.body.text === "string") {
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

  activity.updated = new Date().toISOString();

  saveDB(db);
  res.json(activity);
});

/* Delete activity */
app.delete("/api/planner/:id", (req, res) => {
  const db = loadDB();

  const oldLength = db.planner.length;

  db.planner = db.planner.filter(item => {
    return item.id !== req.params.id;
  });

  if (db.planner.length === oldLength) {
    return res.status(404).json({
      error: "Activity not found."
    });
  }

  saveDB(db);

  res.json({
    success: true
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Date Planner is running on port", PORT);
});
