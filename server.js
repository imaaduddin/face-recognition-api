const express = require("express");
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.json);

const database = {
  users: [
    {
      id: "123",
      name: "Sasuke",
      email: "sasuke@gmail.com",
      // password: "chidori",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "Naruto",
      email: "naruto@gmail.com",
      // password: "iloveramen",
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
  if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
    res.json("success");
  } else {
    res.status(400).json("error logging in");
  }
  res.send("signin");
})

app.post("/register", (req, res) => {
  const {email, name, password} = req.body;
  database.users.push ({
    id: "124",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  })
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

// app.put("/image", (req, res) => {
//   const {id} = req.body;
//   let found = false;
//   database.users.forEach(user => {
//     if (user.id === id) {
//       found = true;
//       user.entries++;
//       return res.json(user.entries);
//     } 
//   })
// })

app.listen(3000, () => {
  console.log("app is running on port 3000");
})

// --> res = this is working 
// signin --> POST = success/fail
// register --> POST = user 
// profile/:userId --> GET = user
// image --> PUT --> user


