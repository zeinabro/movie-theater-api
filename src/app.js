const express = require("express")
const usersRouter = require("../routes/users")
const showsRouter = require("../routes/shows")
const app = express()

app.use("/users", usersRouter)
app.use("/shows", showsRouter)

module.exports = app