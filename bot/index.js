

const TelegramBot = require('node-telegram-bot-api');
const token = '477553552:AAFPFR-UOeW2ObvIIWp8QCQnOyhGTuOWBVo';
const bot = new TelegramBot(token, { polling: true });
exports.bot = bot;

const request = require('request')
const http = require('http')
const axios = require('axios');

const TelegramBaseController = TelegramBot.TelegramBaseController


const COMMAND_TEMPLATE1 = 'template1'
const COMMAND_TEMPLATE2 = 'template2'
const COMMAND_TEMPLATE3 = 'template3'

const VOGLIO_ORDINARE = "Voglio ordinare"
const HO_SBAGLIATO = "Ho sbagliato"
const ORDINI_FATTI = "Ordini fatti"
const ORDINI_NON_ARRIVATI = "Ordini non arrivati"
const SEGNA_COME_ARRIVATO = "Segna come arrivato"
const CERCA_TAVOLA = "Cerca tavola"
//const LASCIA_TAVOLA = "Lascia tavola"

const REMOVE_ME = "Remove me"




inline_keyboard = [];
cercaTavolaMenu = [];
allMenus = [];



// Here starts everything
bot.onText(/\//, (msg) => {
    var telegramUser = msg.from
    request.post('http://localhost:3000/users/insert', {
        json: {
            "telegramId": telegramUser.id,
            "name": telegramUser.first_name,
            "surname": telegramUser.last_name,
            "admin": false,
            "launch": false
        }
    }, (error, res, body) => {
        if (error) {
            console.error(error)
            bot.sendMessage(msg.chat.id, "Something went wrong!")
            return
        }
        console.log(`statusCode: ${res.statusCode}` + body.message)
        //  $.sendMessage("Utente (" + telegramUser.firstName + " " + telegramUser.lastName + ")  " + body.message)
        bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name + ", registrazione effettuata correttamente! Adesso puoi unirti ad un tavolo usando il menu Cerca tavola.", {
            "reply_markup": {
                "keyboard": [
                    [VOGLIO_ORDINARE, HO_SBAGLIATO],
                    [ORDINI_FATTI, ORDINI_NON_ARRIVATI],
                    [SEGNA_COME_ARRIVATO, CERCA_TAVOLA],
                    [REMOVE_ME]
                ]
            }
        });

    })
});

// Catch every messagge text 
bot.on('message', (msg) => {

  //  const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
  //  const LED = new Gpio(17, 'out'); //use GPIO pin 4, and specify that it is output

    if (msg.text.toString() === VOGLIO_ORDINARE){
     

        axios.get('http://localhost:3000/menu/')
        .then(response => {
            let obj = response.data;
            if (obj.message !== false) {
                var result = [];
                const json_ = obj.message;

                json_.forEach(i => result.push(i));
                var due =0;
                // Clean the menuarray
                inline_keyboard = []
                // Constract the Menu Array
                json_.forEach((v,index) => {

                  if(index%5 == 0){
                    inline_keyboard.push([])
                    indiceArray = index/5   
                  }
                        inline_keyboard[indiceArray].push(
                            {
                                text: v.menuId ,
                                callback_data: v.menuId
                            }
                        )
                        allMenus.push(v.menuId.toString())
                  
                })

                bot.sendMessage(msg.chat.id, 'Clickare sul numero del menu per ordinare', {
                    reply_markup: {
                        inline_keyboard
                    }
                })
            }
        })
        .catch(error => {
            console.log(error);
        });
        

            }
    

    else if (msg.text.toString().indexOf(HO_SBAGLIATO) === 0) {

        

    }

    else if (msg.text.toString().toLowerCase().indexOf(ORDINI_FATTI) === 0)
        voglioOrdinare(bot)
    else if (msg.text.toString().indexOf(ORDINI_NON_ARRIVATI) === 0) {

    //    LED.writeSync(0); // Turn LED off
    //    LED.unexport(); // Unexport GPIO to free resources

    }

    else if (msg.text.toString().indexOf(SEGNA_COME_ARRIVATO) === 0) {

    //    if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
   //         LED.writeSync(1); //set pin state to 1 (turn LED on)
          
     //   } else {
    //        LED.writeSync(0); //set pin state to 0 (turn LED off)
    //        LED.unexport(); // U
   //     }
      

    }

    else if (msg.text.toString().indexOf(CERCA_TAVOLA) === 0) {
        axios.get('http://localhost:3000/tavola/' + msg.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    var result = [];
                    const json_ = obj.message;

                    json_.forEach(i => result.push(i));
                    // Clean the menuarray
                    inline_keyboard = []
                    // Constract the Menu Array
                    json_.forEach(v => {
                        inline_keyboard.push(
                            [{
                                text: v.tableName,
                                callback_data: v.tableName
                            }]
                        )
                        cercaTavolaMenu.push(v.tableName.toString())
                    })
                    bot.sendMessage(msg.chat.id, 'Clickare sul tavolo dove vuoi unirti', {
                        reply_markup: {
                            inline_keyboard
                        }
                    })
                }
                else
                bot.sendMessage(msg.chat.id, 'Non sei ancora registrato, clickare / per registrarsi')
            })
            .catch(error => {
                console.log(error);
            });
    }
    else if (msg.text.toString() === REMOVE_ME) {
        var telegramUser = msg.from;
        axios.get('http://localhost:3000/users/find_one/' + telegramUser.id) /// Da fareeeeeeeeeeeeeeeeeeeeeeeeee
            .then(response => {
                let obj = response.data;
                console.log(obj.message)
                if (obj.message) {
                    //###########################################################################
                    const data = JSON.stringify({
                        idT: telegramUser.id
                    })
                    const option = {
                        hostname: 'localhost',
                        port: 3000,
                        path: '/users/delete_one',
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': data.length
                        }
                    }
                    const req = http.request(option, (res) => {
                        console.log(`statusCode: ${res.statusCode}`)
                        res.on('data', (d) => {
                            let obj = JSON.parse(d);
                            bot.sendMessage(msg.chat.id, "Utente: " + telegramUser.first_name + " " + telegramUser.last_name + " " + obj.message)
                        })
                    })
                    req.on('error', (error) => {
                        console.error(error)
                    })
                    req.write(data)
                    req.end()
                    //#########################################################################
                }
                else {
                    bot.sendMessage(msg.chat.id, "Non sei ancora registrato, clickare / per registrarsi ")
                }
            })
            .catch(error => {
                console.log(error);
            });

    }

    else if (msg.text.toString() !== "/") {
        bot.sendMessage(msg.chat.id, "Commando non riconosciuto. Usa il menu qui sotto per continuare.", {
            "reply_markup": {
                "keyboard": [
                    [VOGLIO_ORDINARE, HO_SBAGLIATO],
                    [ORDINI_FATTI, ORDINI_NON_ARRIVATI],
                    [SEGNA_COME_ARRIVATO, CERCA_TAVOLA],
                    [REMOVE_ME]
                ]
            }
        });
    }
    //  bot.sendMessage(msg.chat.id, "Commando non riconosciuto!!!");
})




// Delete an user
bot.on('message', (msg) => {





})



//Risponds when clicks the inline keyboard
bot.on('callback_query', query => {
    const { message: { chat, message_id, text } = {} } = query
    console.log(query)
    // Try to find if the array of menu matches the callback query
    if (cercaTavolaMenu.includes(query.data)) {
        // Here request to add user to the table
        request.post(" http://localhost:3000/tavola/patch/" + query.from.id + "," + query.from.first_name + "," + query.data, (error, res, body) => {
            if (error) {
                console.error(error)
                bot.sendMessage(chat.id, "Something went wrong!")
                return
            }
            else {
                bot.sendMessage(chat.id, body);
            }
        })
    }
    else if (allMenus.includes(query.data)) {

     axios.get('http://localhost:3000/users/find_one/' + query.from.id)
     .then(response => {
         let obj = response.data;
        const tableNme = obj.message[0].table

        request.post('http://localhost:3000/users/insertMenuIntoUser', {
            json: {
                "telegramId" :query.from.id,
                "tableName" : tableNme,
                "menuId" : query.data,
                "quantity" : 1
            }
        }, (error, res, body) => {
            if (error) {
                console.error(error)
                bot.sendMessage(msg.chat.id, "Something went wrong!")
                return
            }
            console.log(`statusCode: ${res.statusCode}` + body.message)
      
            bot.sendMessage(chat.id, "Hai inserito il menu: "+ query.data)
    
        })


     })
     .catch(error => {
         console.log(error);
     });

    }
    bot.answerCallbackQuery({
        callback_query_id: query.id
    })
})

