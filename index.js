const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

let planner = [];

app.get("/", (req, res) => {
  res.send("Date Planner API is running 💖");
});

app.get("/planner", (req, res) => {
  res.json(planner);
});

app.post("/planner", (req, res) => {
  planner.push(req.body);
  res.json({ ok: true });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on", PORT);
});