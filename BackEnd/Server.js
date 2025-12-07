const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const readline = require("readline");

const app = express();
app.use(cors());
app.use(express.json());

// readline → Ask for password at runtime
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter MongoDB password: ", (password) => {
  rl.close();

  const username = "m001-student";
  const cluster = "cluster0.8xhemso.mongodb.net";
  const dbname = "testdb";

  // Build MongoDB connection string dynamically
  const uri = `mongodb+srv://${username}:${password}@${cluster}/${dbname}?retryWrites=true&w=majority`;

  mongoose.connect(uri)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
      console.error("Failed to connect to MongoDB", err);
      process.exit(1);
    });

  // User Schema
  const User = mongoose.model("User", new mongoose.Schema({ name: String }));

  // POST: Save name
  app.post("/save-name", async (req, res) => {
    try {
      const user = new User({ name: req.body.name });
      await user.save();
      res.json({ msg: "Saved successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Failed to save" });
    }
  });

  // GET: All users
  app.get("/users", async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Start server
  const PORT = 5000;
  app.listen(5000, '0.0.0.0', () => console.log("Server running on port 5000"));

});
