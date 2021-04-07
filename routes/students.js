const fs = require('fs')
const path = require('path')

const express = require("express")
const router = express.Router()

const Validator = require("../services/validators")
const DbContext = require("../services/db")
const root = require("../utils").root;
const getCollection = require("../utils").getCollection;

const dbc = new DbContext()
const v = new Validator()
dbc.useCollection("students.json")

router.get("/", (req, res) => {
  dbc.getAll(
    records => res.render("all_students", { students: records }),
    () => res.render("all_students", { students: null })
  )
})

router.get("/add-student", (req, res) => {
  res.render("create_student", {})
});

router.post("/add-student", (req, res) => {
  if (v.isValid(req.body)) {
    dbc.saveOne(req.body, () => res.render("create_student", { success: true }))
  } else {
    res.render("create_student", { error: true, success: false })
  }
})

router.get('/:id/delete', (req, res) => {
  dbc.deleteOne(
    req.params.id, 
    () => res.redirect('/')),
    () => res.sendStatus(500)
})
router.get("/:id/archive", (req, res) => {
  fs.readFile(getCollection('students.json'), (err, data) => {
    if (err) res.sendStatus(500)

    const students = JSON.parse(data)
    const student = students.filter(student => student.id == req.params.id)[0]
    const studentIdx = students.indexOf(student)
    const splicedstudent = students.splice(studentIdx, 1)[0]
    splicedstudent.archive = true
    students.push(splicedstudent)

    fs.writeFile(getCollection('students.json'), JSON.stringify(students), err => {
      if (err) res.sendStatus(500)

      res.redirect('/students')
    })
    
  })
})


router.get("/:id/updateInfo", (req, res) => {
  const id = req.params.id

  fs.readFile(getCollection('students.json'), (err, data) => {
    const students = JSON.parse(data)

    const student = students.filter(student => student.id == id)[0]

    res.render("update", { student: student})
  })

  
});

router.post("/:id/updateInfo", (req, res) => {
  fs.readFile(getCollection('students.json'), (err, data) => {
    if (err) res.sendStatus(500)

    const students = JSON.parse(data)
    const student = students.filter(student => student.id == req.params.id)[0]
    const studentIdx = students.indexOf(student)
    const splicedstudent = students.splice(studentIdx, 1)[0]
    splicedstudent.name = req.body.name
    splicedstudent.dob = req.body.dob
    splicedstudent.surname = req.body.surname
    splicedstudent.faculty = req.body.faculty
    splicedstudent.email = req.body.email
    splicedstudent.mobile = req.body.mobile
    
    

    //splicedstudent.archive = true
    students.push(splicedstudent)

    fs.writeFile(getCollection('students.json'), JSON.stringify(students), err => {
      if (err) res.sendStatus(500)

      res.redirect('/students')
    })
    
  })
})



router.get("/:id", (req, res) => {
  dbc.getOne(
    req.params.id,
    record => res.render("student_detail", { student: record }),
    () => res.sendStatus(404)
  )
})

router.get("/:id/updateInfo", (req, res) => {
  dbc.getOne(
    req.params.id,
    record => res.render("update", { student: record }),
    () => res.sendStatus(404)
  )
})

module.exports = router;

