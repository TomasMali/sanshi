

const Visiting = require('./visitingModel')
const express = require('express')
const router = express.Router()


// First route, get all visiting
/**Da chiamare
 * http://localhost:3000/visiting/
 * 
 */
router.get('/', (req, res, next) => {
    const piva = req.params.piva;

    Visiting.find({}, function (err, docs) {

        // if exsists than the user doesn't have the table set yet
        if (docs.length) {
            res.status(400)
                .json({ message: docs });
        }
        else
            res.status(404)
                .json({ message: "Nessun risultato trovao" });

    })
});


// First route, get all users
/**
 * http://localhost:3000/visiting/getVisiting/MLATMS92P09Z100D
 */
router.get('/getVisiting/:piva', (req, res, next) => {
    const piva = req.params.piva;

    Visiting.find({PIVA: piva}, function (err, docs) {

        // if exsists than the user doesn't have the table set yet
        if (docs.length) {
            res.status(400)
                .json({ message: docs });
        }
        else
            res.status(404)
                .json({ message: "Nessun risultato trovao" });

    })
});


/**
 *  POST REQUEST Inserisce un menu solo se non esiste. 
 * // Da chimare http://localhost:3000/visiting/insert
{
	"piva": "MLATMS92P09Z100C",
	"docname" : "tomas.C20"
}

 */
router.post('/insert', (req, res, next) => {
    const PIVA_ = req.body.piva;
    const DOCNAME_ = req.body.docname;


    Visiting.find({ PIVA: PIVA_ }, function (err, docs) {
        if (docs.length) {
            Visiting.updateOne(
                    { PIVA: PIVA_ },
                    {
                     $inc: { visitTot: 1 },
                        $addToSet: {
                            DOCS: {
                                name: DOCNAME_,
                                dataInsert: new Date()
                            }
                        }
                    }
                ).exec()
                    .then(result => {
                        if (result.nModified != 0)
                            res.send( "Documento: " + DOCNAME_ + " con PIVA: " + PIVA_ + "  Inserito correttamente")
                        else
                            res.send("Documento non inserito correnttamente")
                    })


        } else {
            // Lo creo nuovo
            const Visiting_ = new Visiting({
                PIVA: PIVA_,
                visitTot: 1,
                DOCS: [{
                    name: DOCNAME_,
                    dataInsert: new Date()
                }]

            });
            

            Visiting_.save()
                .then(result => {
              //      console.log("Menu " + result + " inserted correctly!")
                  res.send( "New inserted correctly!")
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({ error: err })
                });


        }
    });

})

module.exports = router;