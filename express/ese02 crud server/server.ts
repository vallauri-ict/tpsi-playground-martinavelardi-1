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

// Middleware di apertura della connessione
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

// Lettura delle collezioni presenti nel db
app.get("/api/getCollections", (req, res, next) => {
    let db = req["client"].db(DBNAME) as _mongodb.Db;
    let request = db.listCollections().toArray();
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

// Middleware di intercettazione dei parametri
let currentCollection = "";
let id = "";
// :id? => id diventa un campo facoltativo
app.use("/api/:collection/:id?", (req, res, next) => {
    currentCollection = req.params.collection;
    id = req.params.id;
    next();
})
/*
app.use("/api/:collection/:id", (req, res, next) => {
    id = req.params.id;
    next();
})
*/


// Listener specifici
// Listener GET
app.patch("/api/*", (req, res, next) => {
    let db = req["client"].db("unicorns") as _mongodb.Db;
    let collection = db.collection(currentCollection);
    if (!id) {
        let request = collection.find().toArray();
        request.then((data) => {
            res.send(data);
        });
        request.catch((err) => {
            res.status(503).send("Errore nella sintassi della query");
        });
        request.finally(() => {
            req["client"].close();
        });
    } else {
        let oId = new _mongodb.ObjectId(id);
        let request = collection.find({ "_id": oId }).toArray();
        request.then((data) => {
            res.send(data);
        });
        request.catch((err) => {
            res.status(503).send("Errore nella sintassi della query");
        });
        request.finally(() => {
            req["client"].close();
        });
    }
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