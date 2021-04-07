const path = require("path");
const fs = require('fs');

const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// routes
const students = require("./routes/students");
const comments = require("./routes/comments");
const getCollection = require("./utils").getCollection;


const db = "database/students.json"
// serving static files
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// setting template engine
app.set("view engine", "pug");

// students urls
app.use("/students", students);
app.use("/comments", comments);

app.get("/", (req, res) => {
  res.render("index", { title: "Hey", message: "Hello there!" });
});

app.get("/update", (req, res) => {
  fs.readFile(getCollection('students.json'), (err, data) => {
    if (err) res.sendStatus(500)
    
    const students = JSON.parse(data).filter(student => student.archive == true)
    res.render("all_students", { title: "Hey", students: students });
  })
});

app.get("/api/v1/students", (req, res) => {
	fs.readFile(db, (err, data) => {
		const students = JSON.parse(data)
		res.json(students)
	})
})
app.get("/alumni", (req, res) => {
  fs.readFile(getCollection('students.json'), (err, data) => {
    if (err) res.sendStatus(500)
    
    const students = JSON.parse(data).filter(student => student.archive == true)
    res.render("all_students", { title: "Hey", students: students });
  })
});

// listen for requests :)
const listener = app.listen(8000, () => {
  console.log(`App is listening on port  http://localhost:8000`);
});
