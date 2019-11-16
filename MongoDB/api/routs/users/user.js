
const User = require('./userModel')

const express = require('express')

const router = express.Router()

const mongoose = require('mongoose')


// First route, get all users
router.get('/', (req, res, next) => {
    const id = req.body.telegramId;
    User.find()
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

// First route, get all users
router.get('/launch', (req, res, next) => {
    User.find({launch: true})
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

// First route, get all users
router.get('/find_one/:telegramId', (req, res, next) => {
    const id = req.params.telegramId;

    User.find({ telegramId: id })
        .exec().
        then(doc => {
            console.log(doc)

            if (doc.length) {
                res.status(200).json({
                   
                    message: doc
                })
            }
            else {
                res.status(200).json({
                    find: false
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
                launch : req.body.launch,
                table: "unknown"
            });
            user_.save()
                .then(result => {
                    console.log("User " + result + " inserted correctly!")
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
            console.log(err)
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
            console.log(err)
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
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
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
        console.log("Updated or Inseerted the tablename to the user");
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });





module.exports = router;