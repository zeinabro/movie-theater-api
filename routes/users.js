const express = require("express")
const sequelize = require("sequelize")
const { User, Show } = require("../models")
const { check, validationResult } = require("express-validator")

const usersRouter = express.Router()
usersRouter.use(express.json())
usersRouter.use(express.urlencoded())

usersRouter.get("/", async(req,res) => {
    const users = await User.findAll({
        attributes: ['id','username','createdAt','updatedAt']
    })
    res.json(users)
})

usersRouter.get("/:id", async(req,res) => {
    const user = await User.findByPk(req.params.id,{
        attributes: ['id','username','createdAt','updatedAt']
    })
    res.json(user)
})

usersRouter.get("/:id/shows", async(req,res) => {
    const user = await User.findByPk(req.params.id,
        {
            include: Show
        }
    )
    const shows = user.shows
    res.json(shows)
})

const validator = [
    check("username").trim().not().isEmpty(),
    check("username").trim().isEmail(),
    check("password").trim().not().isEmpty()
]

usersRouter.post("/", validator, async(req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()})
    } else {
        const user = await User.create({
            username: req.body.username,
            password: req.body.password
        })   
        res.json(user)     
    }
})

usersRouter.put("/:id", async(req,res) => {
    const showID= req.body.showID
    const show = await Show.findByPk(showID)
    const user = await User.findByPk(req.params.id,{
        include: Show
    })
    await user.addShow(show)
    res.json(user)
})

module.exports = usersRouter