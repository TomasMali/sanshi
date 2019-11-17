

const Menu = require('./menuModel')
const User = require('../users/userModel')

const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

const request = require('request')

const axios = require('axios');



// First route, get all Menu
router.get('/:telegramId', (req, res, next) => {
    const id = req.params.telegramId;

                Menu.find()
                    .exec().
                    then(doc => {
                        console.log(doc)
                        res.status(200).json({
                            message: doc
                        })
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(500).json({ error: err })
                    })
        
})
/**
 *  POST REQUEST Inserisce un menu solo se non esiste. 
 * // Da chimare http://localhost:3000/menu/insert
 * {
	"menuId" : 22,
	"name" : sanshi riso,
	"portion" : 2,
	"price" : 6
}
 */
router.post('/insert', (req, res, next) => {
    const menuId = req.body.menuId;
    const name = req.body.name;
    const portion = req.body.portion;
    const price = req.body.price;
    Menu.find({ menuId: menuId }, function (err, docs) {
        if (docs.length) {
            res.status(404)
                .json({ message: "Menu esistente, inserisci un altro nome!" });
        } else {
            const Menu_ = new Menu({
          //      _id: new mongoose.Types.ObjectId(),
                menuId: req.body.menuId,
                name: req.body.name,
                portion: req.body.portion,
                price: req.body.price
            });
            Menu_.save()
                .then(result => {
                    console.log("Menu " + result + " inserted correctly!")
                    res.status(200).json({
                        message: " inserted correctly!",
                    });
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                });

        }
    });

})

module.exports = router;