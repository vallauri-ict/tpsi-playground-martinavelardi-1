import _express from "express";
import * as http from "http";
import * as fs from "fs";
import * as body_parser from "body-parser";

// Mongo
import * as _mongodb from "mongodb"
const mongoClient = _mongodb.MongoClient
const CONNECTIONSTRING = "mongodb+srv://admin:admin03@cluster0.duawc.mongodb.net/5B?retryWrites=true&w=majority";
const DBNAME = "5B";

let port: number = 1337;
let app = _express();   // = funzione di callback, richiamata ogni volta che arriva una richiesta

let server = http.createServer(app);

server.listen(port, () => {
    console.log("Server in ascolto sulla porta " + port);
    init();
});

let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", (err, data) => {
        if (!err) {
            paginaErrore = data.toString();
        } else {
            paginaErrore = "<h2>Risorsa non trovata<h2>";
        }
    })
}



// *************************************************************
// Elenco delle route (listener) di tipo middleware
// 1. Metodo di ascolto
// 2. Callback da eseguire in corrispondenza della richiesta
// *************************************************************

// 1. Log
app.use("/", (req, res, next) => {
    console.log(`--> ${req.method}: ${req.originalUrl}`);
    next();
})

// 2. Static route
app.use("/", _express.static("./static"))   // Passa la cartella

// 3. Lettura parametri post
app.use("/", body_parser.json())
app.use("/", body_parser.urlencoded({ "extended": true }))

// 4. Log parametri
app.use("/", (req, res, next) => {
    if (Object.keys(req.query).length > 0) {
        console.log(`Parametri GET: `, req.query)
    }
    if (Object.keys(req.query).length > 0) {
        console.log(`Paramentri BODY: `, req.query)
    }
    next();
})



// *************************************************************
// Elenco delle routes di risposta al client
// *************************************************************
app.use("/", (req, res, next) => {
    // Apro la connessione e gestisco l'errore. NON risponde al client.
    // next() --> il controllo viene passato alla route successiva che risponde al client
    mongoClient.connect(CONNECTIONSTRING, (err, client) => {
        if (err) {
            res.status(503).send("Errore di connessione al database");
        } else {
            console.log("Connessione ok");
            req["client"] = client;
            next();
        }
    })
})

app.get("/api/servizio1", (req, res, next) => {
    let unicorn = req.query.nome;
    if (unicorn) {
        let db = req["client"].db(DBNAME) as _mongodb.Db;
        let collection = db.collection("unicorns");
        let request = collection.find({ "name": unicorn }).toArray();

        request.then((data) => {
            res.send(data);
        })
        request.catch((err) => {
            res.status(503).send("Errore nella sintassi della query");
        })
        request.finally(() => {
            req["client"].close();
        })
    } else {
        res.status(400).send("Parametro mancante: unicornName");
        req["client"].close();
    }
})

app.patch("/api/servizio2", (req, res, next) => {
    let unicorn = req.body.nome;
    let incVampires = req.body.vampires;
    if (unicorn && incVampires) {
        let db = req["client"].db(DBNAME) as _mongodb.Db;
        let collection = db.collection("unicorns");
        let request = collection.updateOne(
            { "name": unicorn },
            { $inc: { vampires: incVampires } }
        );

        request.then((data) => {
            res.send(data);
        })
        request.catch((err) => {
            res.status(503).send("Errore nella sintassi della query");
        })
        request.finally(() => {
            req["client"].close();
        })
    } else {
        res.status(400).send("Parametro mancante: unicornName / vampires");
        req["client"].close();
    }
})

app.patch("/api/servizio3/:gender/:hair", (req, res, next) => {
    let gender = req.body.gender;
    let hair = req.body.hair;
    // La if non serve perché passa da qui solo se riceve una chiamata di questo tipo
    let db = req["client"].db(DBNAME) as _mongodb.Db;
    let collection = db.collection("unicorns");
    let request = collection.find(
        { $and: [{ "gender": gender }, { "hair": hair }] }
    ).toArray();

    request.then((data) => {
        res.send(data);
    })
    request.catch((err) => {
        res.status(503).send("Errore nella sintassi della query");
    })
    request.finally(() => {
        req["client"].close();
    })
})



// *************************************************************
// Default route e route di gestione degli errori
// Parte se nessuna delle altre ha risposto.
// L'utente ha chiesto una risorsa che non esiste.
// *************************************************************
app.use("/", (req, res, next) => {
    res.status(404);
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Servizio non trovato");
    } else {
        res.send(paginaErrore);
    }
})



// *************************************************************
// Route gestione degli errori
// *************************************************************
app.use((err, req, res, next) => {
    console.log(`Errore codice server ${err.message}`)

});