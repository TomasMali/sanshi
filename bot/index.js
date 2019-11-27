

const TelegramBot = require('node-telegram-bot-api');
// const token = '477553552:AAFPFR-UOeW2ObvIIWp8QCQnOyhGTuOWBVo';
const token = '970100402:AAFS5AcjaBBqgEmNEfHSS30_ESlB1cHg8xw';
const bot = new TelegramBot(token, { polling: true });
exports.bot = bot;

const request = require('request')
const http = require('http')
const axios = require('axios');

const TelegramBaseController = TelegramBot.TelegramBaseController


const COMMAND_TEMPLATE1 = 'template1'
const COMMAND_TEMPLATE2 = 'template2'
const COMMAND_TEMPLATE3 = 'template3'

const VOGLIO_ORDINARE = "\ud83c\udd95 Voglio ordinare"
const HO_SBAGLIATO = "\u2b05\ufe0f Ho sbagliato"
const ORDINI_NON_ARRIVATI = "\u267b\ufe0f Ordini non arrivati"
const ORDINI_ARRIVATI = "\ud83c\udf63 Ordini arrivati"
const SEGNA_COME_ARRIVATO = "\ud83d\udcdd Segna come arrivato"
const CERCA_TAVOLA = "\ud83d\udd0e Cerca tavola"
//const LASCIA_TAVOLA = "Lascia tavola"

const REMOVE_ME = "Remove me"
const SITUAZIONE_TAVOLO = "\ud83d\udcca Situazione"
const MENU = "\ud83d\udcdc Menu"
const ORDINIAMO_INSIEME = "\ud83d\udde3 Tutti insieme"




inline_keyboard = [];
cercaTavolaMenu = [];
allMenus = [];
ordiniFatti = [];
voglioOrdinare = [];
hoSbagliato = [];
segnaComeArrivato = [];



// Here starts everything
bot.onText(/\/start/, (msg) => {
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
            bot.sendMessage(msg.chat.id, "Ops, Something went wrong!")
            return
        }
        console.log(`statusCode: ${res.statusCode}` + body.message)
        //  $.sendMessage("Utente (" + telegramUser.firstName + " " + telegramUser.lastName + ")  " + body.message)
        bot.sendMessage(msg.chat.id, "Welcome " + msg.from.first_name + ", registrazione effettuata correttamente! Adesso puoi unirti ad un tavolo usando il menu Cerca tavola.", {
            "reply_markup": {
                "keyboard": [
                    [VOGLIO_ORDINARE, HO_SBAGLIATO],
                    [ORDINI_NON_ARRIVATI, ORDINI_ARRIVATI],
                    [SEGNA_COME_ARRIVATO, CERCA_TAVOLA],
                    [MENU, SITUAZIONE_TAVOLO, ORDINIAMO_INSIEME]
                ]
            }
        });

    })
});

// Catch every messagge text 
bot.on('message', (msg) => {

    //  const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
    //  const LED = new Gpio(17, 'out'); //use GPIO pin 4, and specify that it is output

    if (msg.text.toString() === VOGLIO_ORDINARE) {

        axios.get('http://localhost:3000/tavola/' + msg.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    // Search if the user has entered in a table
                    axios.get('http://localhost:3000/users/find_one/' + msg.from.id)
                        .then(response => {
                            let obj = response.data;
                            // if(obj.message)
                            const tableNme_ = obj.message[0].table

                            if (tableNme_ !== "unknown") {
                                axios.get('http://localhost:3000/menu/')
                                    .then(response => {
                                        let obj = response.data;
                                        if (obj.message !== false) {
                                            var result = [];
                                            const json_ = obj.message;

                                            json_.forEach(i => result.push(i));
                                            var due = 0;
                                            // Clean the menuarray
                                            inline_keyboard = []
                                            voglioOrdinare = []
                                            allMenus = []
                                            // Constract the Menu Array
                                            json_.forEach((v, index) => {

                                                if (index < 60) {
                                                    if (index % 6 == 0) {
                                                        inline_keyboard.push([])
                                                        indiceArray = index / 6
                                                    }


                                                    inline_keyboard[indiceArray].push(
                                                        {
                                                            text: v.menuId,
                                                            callback_data: v.menuId
                                                        }
                                                    )
                                                }
                                                else {

                                                    if ((index - 60) % 6 == 0) {
                                                        voglioOrdinare.push([])
                                                        indiceArray = (index - 60) / 6
                                                    }

                                                    voglioOrdinare[indiceArray].push(
                                                        {
                                                            text: v.menuId,
                                                            callback_data: v.menuId
                                                        }
                                                    )

                                                }

                                                allMenus.push(v.menuId.toString())

                                            })

                                            bot.sendMessage(msg.chat.id, 'Clickare sul numero del menu per ordinare', {
                                                reply_markup: {
                                                    inline_keyboard,
                                                }
                                            })
                                            inline_keyboard = voglioOrdinare;
                                            bot.sendMessage(msg.chat.id, 'Clickare sul numero del menu per ordinare', {
                                                reply_markup: {
                                                    inline_keyboard
                                                }
                                            })
                                        }
                                    })
                            }
                            else
                                bot.sendMessage(msg.chat.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
                        })
                }
                else
                    bot.sendMessage(msg.chat.id, 'Non sei ancora registrato, clickare / per registrarsi')
            })


    }
    else if (msg.text.toString().indexOf(MENU) === 0) {
        axios.get('http://localhost:3000/tavola/' + msg.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    bot.sendMessage(msg.chat.id, "https://it.sanshi.it/wp-content/uploads/sanshi-Limena-serale.pdf")
                }
                else
                    bot.sendMessage(msg.chat.id, "Non sei ancora registrato, clickare / per registrarsi")
            })

    }


    else if (msg.text.toString().indexOf(HO_SBAGLIATO) === 0) {


        axios.get('http://localhost:3000/tavola/' + msg.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    // Search if the user has entered in a table
                    axios.get('http://localhost:3000/users/find_one/' + msg.from.id)
                        .then(response => {
                            let obj = response.data;
                            // if(obj.message)
                            const tableNme_ = obj.message[0].table

                            if (tableNme_ !== "unknown") {
                                // ########################################################################################################################


                                axios.get('http://localhost:3000/users/ordiniNonArrivati/' + msg.from.id)
                                    .then(response => {
                                        let obj = response.data;
                                        //    console.log("Ciao " + obj)
                                        const menus = obj.message[0].menus;

                                        inline_keyboard = []
                                        hoSbagliato = []

                                        menus.forEach(v => {
                                            console.log(v.tableName + " " + obj.message[0].table)
                                            if (v.tableName === obj.message[0].table) {
                                                inline_keyboard.push(
                                                    [{
                                                        text: v.menuId + "   " + v.name + "  [ " + v.quantity + " ]",
                                                        callback_data: "hoSbagliato" + v.menuId
                                                    }]
                                                )
                                                hoSbagliato.push("hoSbagliato" + v.menuId.toString())
                                            }
                                        })
                                        if (!hoSbagliato.length)
                                            bot.sendMessage(msg.chat.id, "Non esistono ancora menu da cancellare!")
                                        else
                                            bot.sendMessage(msg.chat.id, "Clickare sul menu che vuoi cancellare. Attenzione verrà cancellato l'intero menu anche se è stato ordinato più volte!!!", {
                                                reply_markup: {
                                                    inline_keyboard
                                                }
                                            })
                                    })

                                // ########################################################################################################################
                            }
                            else
                                bot.sendMessage(msg.chat.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
                        })
                }
                else
                    bot.sendMessage(msg.chat.id, 'Non sei ancora registrato, clickare / per registrarsi')
            })
    }

    else if (msg.text.toString().indexOf(ORDINI_NON_ARRIVATI) === 0 ||
        msg.text.toString().indexOf(ORDINI_ARRIVATI) === 0) {

        const arrivati = msg.text.toString().indexOf(ORDINI_ARRIVATI) === 0

        axios.get('http://localhost:3000/tavola/' + msg.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    // Search if the user has entered in a table
                    axios.get('http://localhost:3000/users/find_one/' + msg.from.id)
                        .then(response => {
                            let obj = response.data;
                            // if(obj.message)

                            const tableNme_ = obj.message[0].table

                            if (tableNme_ !== "unknown") {
                                // ########################################################################################################################

                                axios.get('http://localhost:3000/users/ordiniNonArrivati/' + msg.from.id)
                                    .then(response => {
                                        let obj = response.data;
                                        var msgCondition_1 = ""

                                        if (!arrivati)
                                            msgConditioned = 'Sei a posto per questo giro ;), ti è arrivato tutto!!';
                                        else
                                            msgConditioned = 'Non ti è ancora arrivato niente :(';

                                        if (obj.message == false) {
                                            bot.sendMessage(msg.chat.id, msgConditioned)
                                            return;
                                        }
                                        const menus = obj.message[0].menus;
                                        menuAsString = ''
                                        inline_keyboard = []
                                        menus.forEach((v, i) => {
                                            if (v.tableName === obj.message[0].table) {

                                                if (v.arrived < v.quantity && !arrivati)
                                                    inline_keyboard.push(
                                                        [{
                                                            text: "[ " + v.menuId + " ]   " + v.name + "  [ " + (v.quantity - v.arrived) + " ]",
                                                            callback_data: "inutile"
                                                        }]
                                                    )

                                                if (v.arrived > 0 && arrivati)
                                                    inline_keyboard.push(
                                                        [{
                                                            text: "[ " + v.menuId + " ]   " + v.name + "  [ " + v.arrived + " ]",
                                                            callback_data: "inutile"
                                                        }]
                                                    )
                                            }
                                        })
                                        var msgConditioned = ""

                                        if (!inline_keyboard.length) {
                                            msgConditioned = "Non esistono ancora menu da mostrarti"
                                        }
                                        else
                                            if (!arrivati)
                                                msgConditioned = 'Questi sono i tuoi ordini NON ARRIVATI:';
                                            else
                                                msgConditioned = 'Questi sono i tuoi ordini ARRIVATI:';


                                        bot.sendMessage(msg.chat.id, msgConditioned, {
                                            reply_markup: {
                                                inline_keyboard
                                            }
                                        })
                                    })

                                // ########################################################################################################################
                            }
                            else
                                bot.sendMessage(msg.chat.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
                        })
                }
                else
                    bot.sendMessage(msg.chat.id, 'Non sei ancora registrato, clickare / per registrarsi')
            })
    }


    else if (msg.text.toString().indexOf(SEGNA_COME_ARRIVATO) === 0) {
        axios.get('http://localhost:3000/tavola/' + msg.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    // Search if the user has entered in a table
                    axios.get('http://localhost:3000/users/find_one/' + msg.from.id)
                        .then(response => {
                            let obj = response.data;
                            // if(obj.message)
                            const tableNme_ = obj.message[0].table

                            if (tableNme_ !== "unknown") {
                                // ########################################################################################################################

                                axios.get('http://localhost:3000/users/ordiniNonArrivati/' + msg.from.id)
                                    .then(response => {
                                        let obj = response.data;

                                        if (obj.message == false) {
                                            bot.sendMessage(msg.chat.id, 'Non hai effettuato ancora ordini!')
                                            return;
                                        }
                                        const menus = obj.message[0].menus;

                                        inline_keyboard = []
                                        segnaComeArrivato = []
                                        menus.forEach((v, i) => {
                                            if (v.tableName === obj.message[0].table) {
                                                if (v.arrived < v.quantity) {
                                                    inline_keyboard.push(
                                                        [{
                                                            text: "[ " + v.menuId + " ]   " + v.name + "  [ " + (v.quantity - v.arrived) + " ]",
                                                            callback_data: "segnaComeArrivato" + v.menuId
                                                        }]
                                                    )
                                                    segnaComeArrivato.push("segnaComeArrivato" + v.menuId.toString())
                                                }
                                            }
                                        })
                                        var messaggio = "Clicka sull'ordine per segnarlo come Arrivato (1 click = 1 porzione)"

                                        console.log(segnaComeArrivato)
                                        if (!segnaComeArrivato.length) {
                                            messaggio = "Non esistono ancora menu da mostrarti"
                                        }

                                        bot.sendMessage(msg.chat.id, messaggio, {
                                            reply_markup: {
                                                inline_keyboard
                                            }
                                        })

                                    })

                                // ########################################################################################################################
                            }
                            else
                                bot.sendMessage(msg.from.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
                        })
                }
                else
                    bot.sendMessage(msg.from.id, 'Non sei ancora registrato, clickare / per registrarsi')

            })

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
    else if (msg.text.toString() === SITUAZIONE_TAVOLO) {

        axios.get('http://localhost:3000/tavola/' + msg.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    // Search if the user has entered in a table
                    axios.get('http://localhost:3000/users/find_one/' + msg.from.id)
                        .then(response => {
                            let obj = response.data;
                            // if(obj.message)
                            const tableNme_ = obj.message[0].table

                            if (tableNme_ !== "unknown") {
                                // ########################################################################################################################
                                users = []
                                axios.get('http://localhost:3000/users')
                                    .then(response => {
                                        let obj = response.data;
                                        if (!obj.message.length) {
                                            bot.sendMessage(msg.chat.id, "Nessun utente trovato! ")
                                            return;
                                        }
                                        // lists od users []
                                        const users_1 = obj.message;
                                        inline_keyboard = []
                                        var arrivedTot = 0
                                        var notArrivedTot = 0

                                        users_1.forEach((v, i) => {
                                            // only users with the same table name
                                            console.log("Debug users dd  " + tableNme_ + "  " + v.table)
                                            if (tableNme_.toString() == v.table.toString()) {
                                                console.log("Debug users " + v)
                                                menusForUser = v.menus;
                                                arrived = 0;
                                                notArrived = 0;
                                                menusForUser.forEach((u, i) => {
                                                    // Se il menu è dello stesso tavolo
                                                    if (v.table === u.tableName) {
                                                        // Ordine non arrivato
                                                        if (u.arrived < u.quantity) {
                                                            notArrived += (u.quantity - u.arrived)
                                                            notArrivedTot+= (u.quantity - u.arrived)
                                                        }
                                                        else {
                                                            arrived+=u.arrived
                                                            arrivedTot+=u.arrived
                                                        }
                                                    }
                                                })

                                                inline_keyboard.push(
                                                    [{
                                                        text: v.name + "    Arrivati [ " + arrived + " ]     Da arrivare [ " + notArrived + " ]",
                                                        callback_data: "Non Importa"
                                                    }]
                                                )
                                            }

                                        })


                                        inline_keyboard.push(
                                            [{
                                                text: "****************************************** ",
                                                callback_data: "Non Importa"
                                            }]
                                        )

                                        inline_keyboard.push(
                                            [{
                                                text: "TOTALE: " + "    Arrivati [ " + arrivedTot + " ]     Da arrivare [ " + notArrivedTot + " ]",
                                                callback_data: "Non Importa"
                                            }]
                                        )
                                        bot.sendMessage(msg.from.id, "Situazione tavola: " + tableNme_, {
                                            reply_markup: {
                                                inline_keyboard
                                            }
                                        })
                                    })
                                // ########################################################################################################################
                            }
                            else
                                bot.sendMessage(msg.from.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
                        })
                }
                else
                    bot.sendMessage(msg.from.id, 'Non sei ancora registrato, clickare / per registrarsi')
            })
    }




    else if (msg.text.toString() === ORDINIAMO_INSIEME) {



        axios.get('http://localhost:3000/tavola/' + msg.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    // Search if the user has entered in a table
                    axios.get('http://localhost:3000/users/find_one/' + msg.from.id)
                        .then(response => {
                            let obj = response.data;
                            // if(obj.message)
                            const tableNme_ = obj.message[0].table

                            if (tableNme_ !== "unknown") {
                                // ########################################################################################################################
                                users = []
                                menus_ = []
                                quantità_ = []
                                axios.get('http://localhost:3000/users')
                                    .then(response => {
                                        let obj = response.data;
                                        if (!obj.message.length) {
                                            bot.sendMessage(msg.chat.id, "Nessun utente trovato! ")
                                            return;
                                        }
                                        // lists od users []
                                        const users_1 = obj.message;
                                        inline_keyboard = []


                                        users_1.forEach((v) => {
                                            // only users with the same table name
                                       //     console.log("Debug users dd  " + tableNme_ + "  " + v.table)

                                            if (tableNme_.toString() == v.table.toString()) {   
                                            menusForUser = []
                                            menusForUser = v.menus;
                                  
                                            menusForUser.forEach((u, i) => {
                                                // Se il menu è dello stesso tavolo
                                              
                                                if (v.table.toString() === u.tableName.toString()) {
                                                    console.log("Debug users " + v.table.toString() + "    " + u.tableName.toString())
                                                    // if menu exists, the quantity has to be increased
                                                    if (menus_.includes(u.menuId)) {
                                                        indice = menus_.indexOf(u.menuId)
                                                        quantità_[indice]++
                                                    }
                                                    else {
                                                        menus_.push(u.menuId)
                                                        quantità_.push(u.quantity - u.arrived)
                                                    }

                                                }
                                            })
                                        }
                                        })


                                        inline_keyboard.push(
                                            [{
                                                text: "****************************************** ",
                                                callback_data: "Non Importa"
                                            }]
                                        )
                                        menus_.forEach((V, i) => {
                                            if (quantità_[i] > 0)
                                                inline_keyboard.push(
                                                    [{
                                                        text: "CodiceMenu [ " + V + " ]     Da arrivare [ " + quantità_[i] + " ]",
                                                        callback_data: "Non Importa"
                                                    }]
                                                )

                                        })
                                        inline_keyboard.push(
                                            [{
                                                text: "****************************************** ",
                                                callback_data: "Non Importa"
                                            }]
                                        )
                                        var smgToSend = "Lista degli ordini per il tavolo : " + tableNme_
                                        if (inline_keyboard.length > 1){
                                            smgToSend = "Non c'è niente da ordinare per il tavolo : " + tableNme_
                                        }
                                           

                                        bot.sendMessage(msg.from.id, smgToSend, {
                                            reply_markup: {
                                                inline_keyboard
                                            }
                                        })
                                    })
                                // ########################################################################################################################
                            }
                            else
                                bot.sendMessage(msg.from.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
                        })
                }
                else
                    bot.sendMessage(msg.from.id, 'Non sei ancora registrato, clickare / per registrarsi')
            })
    }






    else if (msg.text.toString() !== "/start") {
        bot.sendMessage(msg.chat.id, "Commando non riconosciuto. Usa il menu qui sotto per continuare.", {
            "reply_markup": {
                "keyboard": [
                    [VOGLIO_ORDINARE, HO_SBAGLIATO],
                    [ORDINI_NON_ARRIVATI, ORDINI_ARRIVATI],
                    [SEGNA_COME_ARRIVATO, CERCA_TAVOLA],
                    [MENU, SITUAZIONE_TAVOLO, ORDINIAMO_INSIEME]
                ]
            }
        });
    }
})



//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */
//*************************************************************************************************************************** */


//Risponds when clicks the inline keyboard
bot.on('callback_query', query => {
    const { message: { chat, message_id, text } = {} } = query
    // console.log(query)
    // Try to find if the array of menu matches the callback query
    if (cercaTavolaMenu.includes(query.data)) {
        const menuId = query.data.toString().substr(15)
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
        //  const menuId = query.data.toString().substr(15)
        axios.get('http://localhost:3000/users/find_one/' + query.from.id)
            .then(response => {
                let obj = response.data;
                let tableNme = obj.message[0].table
                console.log("Primasaasd : " + tableNme + " " + query.from.id)

                if (tableNme !== "")
                    request.post('http://localhost:3000/users/insertMenuIntoUser', {
                        json: {
                            "telegramId": query.from.id,
                            "tableName": tableNme,
                            "menuId": query.data,
                            "quantity": 1
                        }
                    }, (error, res, body) => {
                        if (error) {
                            console.error(error)
                            bot.sendMessage(msg.chat.id, "Something went wrong!")
                            return
                        }
                        bot.sendMessage(chat.id, "Hai inserito il menu: " + query.data)

                    })
                else
                    bot.sendMessage(chat.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
            })
            .catch(error => {
                console.log(error);
            });

    }


    else if (hoSbagliato.includes(query.data)) {
        const menuId = query.data.toString().substr(11)

        axios.get('http://localhost:3000/tavola/' + query.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    // Search if the user has entered in a table
                    axios.get('http://localhost:3000/users/find_one/' + query.from.id)
                        .then(response => {
                            let obj = response.data;
                            // if(obj.message)
                            const tableNme_ = obj.message[0].table

                            if (tableNme_ !== "unknown") {
                                // ########################################################################################################################

                                var telegramUser = query.from
                                request.post('http://localhost:3000/users/hoSbagliato', {
                                    json: {
                                        "telegramId": telegramUser.id,
                                        "tableName": tableNme_,
                                        "menuId": menuId
                                    }
                                }, (error, res, body) => {
                                    bot.sendMessage(query.from.id, body)

                                    console.log(body)

                                })

                                // ########################################################################################################################
                            }
                            else
                                bot.sendMessage(query.from.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
                        })
                }
                else
                    bot.sendMessage(query.from.id, 'Non sei ancora registrato, clickare / per registrarsi')

            })

    }

    else if (segnaComeArrivato.includes(query.data)) {

        const menuId = query.data.toString().substr(17)

        axios.get('http://localhost:3000/tavola/' + query.from.id)
            .then(response => {
                let obj = response.data;
                if (obj.message !== false) {
                    // Search if the user has entered in a table
                    axios.get('http://localhost:3000/users/find_one/' + query.from.id)
                        .then(response => {
                            let obj = response.data;
                            // if(obj.message)
                            const tableNme_ = obj.message[0].table

                            if (tableNme_ !== "unknown") {
                                // ########################################################################################################################

                                var telegramUser = query.from
                                request.post('http://localhost:3000/users/segnalaComeArrivato', {
                                    json: {
                                        "telegramId": telegramUser.id,
                                        "tableName": tableNme_,
                                        "menuId": menuId
                                    }
                                }, (error, res, body) => {
                                    bot.sendMessage(query.from.id, body)

                                    console.log(body)

                                })

                                // ########################################################################################################################
                            }
                            else
                                bot.sendMessage(query.from.id, 'Prima unisciti al tavolo con il menu Cerca tavolo!')
                        })
                }
                else
                    bot.sendMessage(query.from.id, 'Non sei ancora registrato, clickare / per registrarsi')

            })

    }




    else
        console.log("Non è entrato")
    bot.answerCallbackQuery({
        callback_query_id: query.id
    }, { text: 'Your message' })
})

