
const User = require('./userModel')

const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')

const axios = require('axios');

const request = require('request');


// First route, get all users
router.get('/', (req, res, next) => {
    // const id = req.body.telegramId;
    User.find()
        .exec().
        then(doc => {
            // console.log(doc)
            if (doc.length)
                res.status(200).json({
                    message: doc
                })
            else
                res.status(200).json({
                    message: false
                })

        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({ error: err })
        })

})

// First route, get all users
router.get('/launch', (req, res, next) => {
    User.find({ launch: true })
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
})


// First route, get all users
router.get('/getTable', (req, res, next) => {
    const id = req.body.telegramId;

    User.find({ telegramId: id, table: "unknown" }, function (err, docs) {

        // if exsists than the user doesn't have the table set yet
        if (docs.length) {
            res.status(404)
                .json({ message: false });
        }
        else
            res.status(404)
                .json({ message: true });

    })
});





// First route, get all users
router.get('/find_one/:telegramId', (req, res, next) => {
    const id = req.params.telegramId;

    User.find({ telegramId: id })
        .exec().
        then(doc => {
            // console.log(doc)

            if (doc.length) {
                res.status(200).json({

                    message: doc
                })
            }
            else {
                res.status(200).json({
                    message: false
                })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })

})





// Get all menus not yet arrived of a user
router.get('/ordiniNonArrivati/:telegramId', (req, res, next) => {
    const id = req.params.telegramId;

    User.find({ telegramId: id })
        .exec().
        then(doc => {
            //   // console.log(doc)

            if (doc.length) {
                res.status(200).json({

                    message: doc
                })
            }
            else {
                res.status(200).json({
                    message: false
                })
            }
        })
        .catch(err => {
            res.status(500).json({ error: err })
        })

})




// POST REQUEST
router.post('/insert', (req, res, next) => {
    const id = req.body.telegramId;
    User.find({ telegramId: id }, function (err, docs) {

        if (docs.length) {
            res
                .status(404)
                .json({ message: "already exsists!" });
        } else {
            const user_ = new User({
                _id: new mongoose.Types.ObjectId(),
                telegramId: req.body.telegramId,
                name: req.body.name,
                surname: req.body.surname,
                admin: req.body.admin,
                launch: req.body.launch,
                table: "unknown",
                menus: []
            });
            user_.save()
                .then(result => {
                    // console.log("User " + result + " inserted correctly!")
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
 * POST REQUEST -> inser a menu into an user
 * Call it with http://localhost:3000/users/insertMenuIntoUser
 * {
	"telegramId" :145645559,
	"tableName" : "Tavola 42",
	"menuId" : 22,
	"quantity" : 1
}
 */
router.post('/insertMenuIntoUser', (req, res, next) => {
    const id = req.body.telegramId;
    var tableName = req.body.tableName;
    const menuId = req.body.menuId;
    const quantity = req.body.quantity;

    // console.log(id + " " + tableName + " " + menuId + " " + quantity)


    User.find({ telegramId: id, table: "unknown" }, function (err, docs) {

        // if exsists than the user doesn't have the table set yet
        if (docs.length) {
            res.send("Prima devi scegliere un tavolo con Cerca tavolo!")
        }
        else {
            User.find({ telegramId: id, table: tableName }, function (err, docs) {

                if (!docs.length) {
                    res
                        .status(404)
                        .json({ message: "User or Table or Menu doesn't exsists" });
                } else {

                    // Search for the table 

                    User.find({ telegramId: id, table: tableName ,
                           
                            menus: { $elemMatch: { menuId: menuId, tableName: tableName } }
                        
                    }, function (err, docs) {
                        console.log(" ############################  id " + id + " tableNme:" + tableName + " menuID:" + menuId)

                        console.log("DOCS     :  " + docs)


                        // inserts the menu if it doesn't exist
                        if (!docs.length) {

                            console.log(" ################e entrato ############  id " + id + " tableNme:" + tableName + " menuID:" + menuId)


                            request('http://localhost:3000/menu/getMenu/' + menuId, { json: true }, (err, resp, body) => {
                                if (err) { return console.log(err); }
                                //     console.log(body.message[0].name);
                                const menuAsString = body.message[0];

                                User.updateOne(
                                    { telegramId: id, table: tableName },
                                    {
                                        $addToSet: {
                                            menus: {
                                                tableName: tableName,
                                                menuId: menuId,
                                                name: menuAsString.name,
                                                portion: menuAsString.portion,
                                                price: menuAsString.price,
                                                quantity: 1,
                                                arrived: 0
                                            }
                                        }
                                    }
                                ).exec()
                                    .then(result => {
                                        if (result.nModified != 0)
                                            res.send("Menu: " + menuId + " Inserito correttamente nell'ordine. ")
                                        else
                                            res.send("Menu non inserito correnttamente")
                                    })


                            });

                        }
                        // Menues already exists, so only update the quantity
                        else {
                            console.log("TOMAS :" + tableName + " " + menuId + " " + docs.length + " Quantity: " + quantity)


                            User.updateOne(

                                {
                                    telegramId: id, table: tableName,
                                    menus: { $elemMatch: { menuId: menuId, tableName: tableName } }
                                },

                                { $inc: { 'menus.$.quantity': quantity } }

                            ).exec()
                                .then(result => {
                                    if (result.nModified != 0)
                                        res.send("Menu: " + menuId + " Aggiornato correttamente nell'ordine. ")
                                    else
                                        res.send("Menu non aggiornato correnttamente")
                                })
                        }
                    });

                }
            });
        }

    })


})


/**
 * POST REQUEST -> inser a menu into an user
 * Call it with http://localhost:3000/users/hoSbagliato
 * {
	"telegramId" :145645559,
	"tableName" : "Tavola 42",
	"menuId" : 22
}
 */
router.post('/hoSbagliato', (req, res, next) => {
    const id = req.body.telegramId;
    const tableName = req.body.tableName;
    const menuId = req.body.menuId;
    //  // console.log(id + " " + tableName + " " + menuId)


    User.find({ telegramId: id, table: "unknown" }, function (err, docs) {

        // if exsists than the user doesn't have the table set yet
        if (docs.length) {
            res.send("Prima unisciti al tavolo con il menu Cerca tavolo!")
        }
        else {

            User.updateOne(
                { telegramId: id, table: tableName},
                   
                { $pull: { "menus" : { menuId: menuId, tableName: tableName } }
             }

            ).exec()
                .then(result => {
                    if (result.nModified != 0)
                        res.send("Il menu: " + menuId + " Rimosso correttamente. inseriscilo di nuovo con il tasto Voglio ordinare")
                    else
                        res.send("Menu non trovato!")
                })
        }
    })
})





/**
 * POST REQUEST -> inser a menu into an user
 * Call it with http://localhost:3000/users/hoSbagliato
 * {
	"telegramId" :145645559,
	"tableName" : "Tavola 42",
	"menuId" : 22
}
 */
router.post('/segnalaComeArrivato', (req, res, next) => {
    const id = req.body.telegramId;
    const tableName = req.body.tableName;
    const menuId = req.body.menuId;
    // console.log(id + " " + tableName + " " + menuId)
    User.updateOne(
        { telegramId: id, table: tableName,  
             menus: { $elemMatch: { menuId: menuId, tableName: tableName } } },
        { $inc: { "menus.$.arrived": 1 } }
    ).exec()
        .then(result => {
            if (result.nModified != 0)
                res.send("Menu: " + menuId + " Segnato come arrivato.")
            else
                res.send("Menu non trovato!")
        })

})




// DELETE  the single user 
router.delete('/delete_one', (req, res, next) => {
    const idT = req.body.idT;

    User.remove({ telegramId: idT })
        .exec()
        .then(result => {
            res.status(500).json({
                message: " rimosso correttamente!"
            })
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                error: err
            })
        })
});

// DELETE ALL the user 
router.delete('/delete_all', (req, res, next) => {
    User.deleteMany({})
        .exec()
        .then(result => {
            res.status(500).json(result)
        })
        .catch(err => {
            // console.log(err)
            res.status(500).json({
                error: err
            })
        })
});



router.patch("/patch/:idT", (req, res, next) => {
    const id = req.params.idT;
    User.update({ telegramId: id }, { $set: req.body })
        .exec()
        .then(result => {
            // console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// Insert the tablename to an existing user
router.patch("/patch/:tableName", (req, res, next) => {
    const id = req.params.tableName;
    User.update({ tableName: tableName }, { $set: req.body })
        .exec()
        .then(result => {
            // console.log("Updated or Inseerted the tablename to the user");
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});





module.exports = router;