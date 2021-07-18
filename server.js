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
  db.select("email", "hash").from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSynce(req.body.password, data[0].hash);
      if (isValid) {
        db.select("*").from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json("unable to get user"))
      }
    })
    .catch(err => res.status(400).json("wrong credentials"))
})

app.post("/register", (req, res) => {
  const {email, name, password} = req.body;
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
        .returning("*")
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0]);
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("unable to register"))
})

app.get("/profile/:id", (re, res) => {
  const {id} = req.params;
  db.select("*").from("users").where({
    id: id
  })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json("error getting user")
      }
  })
})

app.put("/image", (req, res) => {
  const {id} = req.body;
  db("users").where("id", "=", id)
  .increment("entries", 1)
  .returning("entries")
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json("unable to get entries"));
})



app.listen(3000, () => {
  console.log("app is running on port 3000");
})

// --> res = this is working 
// signin --> POST = success/fail
// register --> POST = user 
// profile/:userId --> GET = user
// image --> PUT --> user


