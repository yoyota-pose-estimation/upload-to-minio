const express = require("express")
const bodyParser = require("body-parser")
const compression = require("compression")
const helmet = require("helmet")

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.use(helmet())

app.get("/healthz", (_, res) => {
  res.status(204).send()
})

app.get("/", (_, res) => {
  res.send("home")
})

module.exports = app
