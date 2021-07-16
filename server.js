const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host : "127.0.0.1",
    user : "imaad uddin",
    password : "your_database_password",
    database : "smart-brain"
  }
});


const app = express();

app.use(bodyParser.json);
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "Sasuke",
      email: "sasuke@gmail.com",
      password: "chidori",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Naruto",
      email: "naruto@gmail.com",
      password: "iloveramen",
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: "987",
      hask: "",
      email: "sasuke@gmail.com"
    }
  ]
}

app.get("/", (reg, res) => {
  res.send("this is working!");
})

app.post("/signin", (req, res) => {
  bcrypt.compare("bacon", hash, function(err, res) {

  });
  bcrypt.compare("veggies", hash, function(err, res) {

  });
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    // res.json("success");
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
  res.send("signin");
})

app.post("/register", (req, res) => {
  const {email, name, password} = req.body;
  db("users").insert({
    email: email,
    name: name,
    joined: new Date()
  }).then(console.log)
  res.json(database.users[database.users.length-1]);
})

app.get("/profile/:id", (re, res) => {
  const {id} = req.params;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    } 
  })
  if (!found) {
    res.status(400).json("status not found");
  }
})

app.put("/image", (req, res) => {
  const {id} = req.body;
  let found = false;
  database.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    } 
  })
  if (!found) {
    res.status(400).json("status not found");
  }
})



app.listen(3000, () => {
  console.log("app is running on port 3000");
})

// --> res = this is working 
// signin --> POST = success/fail
// register --> POST = user 
// profile/:userId --> GET = user
// image --> PUT --> user


