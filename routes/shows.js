const express = require("express")
const sequelize = require("sequelize")
const { User, Show } = require("../models")
const { check, validationResult } = require("express-validator")

const showsRouter = express.Router()
showsRouter.use(express.json())
showsRouter.use(express.urlencoded())

showsRouter.get("/", async(req,res) => {
    const shows = await Show.findAll()
    res.json(shows)
})

showsRouter.get("/:id", async(req,res) => {
    const show = await Show.findByPk(req.params.id)
    res.json(show)
})

showsRouter.get("/:id/users", async(req,res) => {
    const show = await Show.findByPk(req.params.id,{
        include: {
            model: User,
            attributes: ['id','username']    
        }    
    })
    res.json(show.users)
})

showsRouter.get("/genre/:genre", async(req,res) => {
    const shows = await Show.findAll({
        where: { 
            genre: req.params.genre
        }
    })
    res.json(shows)
})

const validator = [
    check("title").isLength({min:1, max: 25})
]

showsRouter.post("/", validator, async(req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()})
    } else {
        const show = await Show.create({
            title: req.body.title,
            genre: req.body.genre,
            rating: req.body.rating,
            available: req.body.available
        })
        res.json(show)
    }
})

showsRouter.put("/:id/available", async(req,res) => {
    const show = await Show.findByPk(req.params.id)
    await show.update({
        title: show.title,
        genre: show.genre,
        rating: show.rating,
        available: !show.available
    })
    res.json(show)
})

showsRouter.put("/:id/rating", [check("rating").not().isEmpty()] ,async(req,res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({error: errors.array()})
    } else {
        const show = await Show.findByPk(req.params.id)
        await show.update({
            title: show.title,
            genre: show.genre,
            rating: req.body.rating,
            available: show.available
        })
        res.json(show)
    }
})

showsRouter.delete("/:id", async(req,res) => {
    await Show.destroy({
        where: {
            id: req.params.id
        }
    })
    res.send("Show deleted successfully")
})

module.exports = showsRouter