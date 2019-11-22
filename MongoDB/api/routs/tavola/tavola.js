

const Tavola = require('./tavolaModel')

const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

const request = require('request')

const axios = require('axios');


const User = require('../users/userModel')



// First route, get all Tavola
router.get('/:telegramId', (req, res, next) => {
    const id = req.params.telegramId;
    axios.get('http://localhost:3000/users/find_one/' + id)
        .then(response => {
            let obj = response.data;
            if (obj.message === false )
            res.status(200).json({
                message: false
            })
            else {
                // ############################ USER CONTROLL ################################################
                Tavola.find()
                    .exec().
                    then(doc => {
                        // console.log(doc)
                        res.status(200).json({
                            message: doc
                        })
                    })
                    .catch(err => {
                        // console.log(err)
                        res.status(500).json({ error: err })
                    })
                // ############################## END OF USER CONTROLL ##############################################
            }
        })
        
})

/**
 *  POST REQUEST Inserisce un tavolo solo se non esiste. 
 * // Da chimare http://localhost:3000/tavola/insert
 * {
	"tableName" : "Tavola 42",
	"telegramId" : 12387654,
	"partecipanti" : ["Tomas","mali"],
	"surname" : "Tomas",
	"admin" : true
}
 */
router.post('/insert', (req, res, next) => {
    const table = req.body.tableName;
    Tavola.find({ tableName: table }, function (err, docs) {
        if (docs.length) {
            res.status(404)
                .json({ message: "Tavola esistente, scegli un altro nome!" });
        } else {
            const Tavola_ = new Tavola({
                _id: new mongoose.Types.ObjectId(),
                telegramId: req.body.telegramId,
                tableName: req.body.tableName,
                partecipanti: req.body.partecipanti,
                surname: req.body.surname,
                admin: req.body.admin,
                launch: req.body.launch
            });
            Tavola_.save()
                .then(result => {
                    // console.log("Tavola " + result + " inserted correctly!")
                    res.status(200).json({
                        message: " inserted correctly!",
                    });
                })
                .catch(err => {
                    // console.log(err)
                    res.status(500).json({ error: err })
                });

        }
    });

})

/**
 *  Adds an user to the table, given the table name 
 *  http://localhost:3000/tavola/patch/newuser,tableName
 */
router.post("/patch/:id,:newUser,:tableName", (req, res, next) => {
    const newUser_ = req.params.newUser;
    const tableName_ = req.params.tableName
    const id_ = req.params.id

    axios.get('http://localhost:3000/users/find_one/' + id_)
        .then(response => {
            let obj = response.data;
            if (!obj.message)
                res.send("Non sei ancora registrato, clickare / per registrarsi ");
            else {
                // ############################ USER CONTROLL ################################################
                Tavola.updateMany(
                    {},
                    { $pull: { partecipanti: id_ } },
                    { multi: true }
                ).exec()
                    .then(result => {
                        // console.log("Utente: " + newUser_ + " rimosso dal tavolo: " + tableName_ + " correttamente")
                        // Insert the tablename to an existing User
                        User.updateOne({ telegramId: id_ }, { $set: { table: tableName_ } })
                            .exec()
                            .then(result => {
                                // console.log("Updated or Inseerted the tablename to the current user");
                                Tavola.updateOne({ tableName: tableName_ }, { $addToSet: { partecipanti: id_ } })
                                    .exec()
                                    .then(result => {
                                        if (result.nModified != 0)
                                            res.send("Utente: " + newUser_ + " Inserito correttamente nel tavolo " + tableName_ + ". \n Adesso puoi effettuare il tuo ordine utilizzando il menu: Voglio ordinare.")
                                        else
                                            res.send("Utente: " + newUser_ + "' già esistente per il tavolo " + tableName_)
                                    })
                                    .catch(err => {
                                        // console.log(err);
                                        res.send("Richiesta non andata a buon fine")
                                    });
                            })
                            .catch(err => {
                                // console.log("Error nell'update " + err);
                                res.send("Richiesta non andata a buon fine")
                            });
                    })
                    .catch(err => {
                        // console.log(err)
                        res.send("Richiesta non andata a buon fine")
                    })
                // ############################## END OF USER CONTROLL ##############################################
            }
        })

});



/**
 * DELETE  the single Table 
 * http://localhost:3000/tavola/delete_one
 * {
 *	"tableName" : "Tavola 42"
 *  }
 */
router.delete('/delete_one', (req, res, next) => {
    const table_ = req.body.tableName;
    Tavola.deleteOne({ tableName: table_ })
        .exec()
        .then(result => {
            // console.log(result)
            if (result.deletedCount != 0)
                res.status(500).json({
                    message: "Tavola '" + table_ + "' removed correctly!"
                })
            else
                res.status(500).json({
                    message: "Cancellazione fallita perché la Tavola '" + table_ + "' Non esisteva!"
                })
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                error: err
            })
        })
});



module.exports = router;