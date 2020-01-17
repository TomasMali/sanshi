

const Visiting = require('./visitingModel')
const express = require('express')
const router = express.Router()


// First route, get all visiting
/**Da chiamare
 * http://localhost:3000/visiting/
 * 
 */
// First route, get all Menu
router.get('/', (req, res, next) => {
    //  const id = req.params.telegramId;
    Visiting.find()
          .exec().
          then(doc => {
              if(doc.length){
               //   console.log(doc.length)
                  res.status(200).json({
                      message: doc
                  })
              }
              else
              res.status(200).json({
                  message: false
              })
         
          })
          .catch(err => {
              console.log(err)
              res.status(500).json({ error: err })
          })
  
  })


// First route, get all users
/**
 * http://localhost:3000/visiting/getVisiting/MLATMS92P09Z100D
 */
router.get('/getVisiting/:piva', (req, res, next) => {
    const piva = req.params.piva;
    Visiting.find({PIVA: piva})
          .exec().
          then(doc => {
            if (doc.length) {
                res.status(200)
                    .json({ message: doc});
            }
            else
                res.status(200)
                    .json({ message: "Nessun risultato trovao" });
    
         
          })
          .catch(err => {
              console.log(err)
              res.status(500).json({ error: err })
          })
  
  })


/**
 *  POST REQUEST Inserisce un menu solo se non esiste. 
 * // Da chimare  
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
                                dataInsert: new Date().toString('yyyy-MM-dd')
                            }
                        }
                    }
                ).exec()
                    .then(result => {
                        if (result.nModified != 0)
                        res.status(200)
                        .json({ message: "Documento: " + DOCNAME_ + " con PIVA: " + PIVA_ + "  Inserito correttamente"});
                     
                        else
                        res.status(200)
                        .json({ message: "Documento non inserito correnttamente"});
                      
                    })


        } else {
            // Lo creo nuovo
            const Visiting_ = new Visiting({
                PIVA: PIVA_,
                visitTot: 1,
                DOCS: [{
                    name: DOCNAME_,
                    dataInsert: new Date().toString('yyyy-MM-dd')
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