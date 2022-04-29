"use strict"

// ***************************** Librerie *************************************
import fs from "fs";
import http from "http";
import https from "https";
import express from "express";
import body_parser from "body-parser";
import cors from "cors";
import fileUpload, { UploadedFile } from "express-fileupload";
import cloudinary, { UploadApiResponse } from "cloudinary";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import environment from "./environment.json"
import { createToken } from "typescript";

// ***************************** Costanti *************************************
const app = express();
const CONNECTION_STRING = environment.CONNECTION_STRING_LOCAL
const DBNAME = "5B"
const DURATA_TOKEN = 60 // sec
const HTTP_PORT = 1337
const HTTPS_PORT = 1338
const privateKey = fs.readFileSync("keys/privateKey.pem", "utf8");
const certificate = fs.readFileSync("keys/certificate.crt", "utf8");
const jwtkeys = fs.readFileSync("keys/jwtkeys.pem", "utf8");
const credentials = { "key": privateKey, "cert": certificate };
cloudinary.v2.config({
    cloud_name: environment.CLOUDINARY.CLOUD_NAME,
    api_key: environment.CLOUDINARY.API_KEY,
    api_secret: environment.CLOUDINARY.API_SECRET,
})



// ***************************** Avvio ****************************************
const httpsServer = https.createServer(credentials, app);
httpsServer.listen(HTTPS_PORT, function () {
    console.log("Server HTTPS in ascolto sulla porta " + HTTPS_PORT);
    init();
});
let paginaErrore = "";
function init() {
    fs.readFile("./static/error.html", function (err, data) {
        if (!err)
            paginaErrore = data.toString();
        else
            paginaErrore = "<h1>Risorsa non trovata</h1>"
    });
}
// app.response.log = function(err){console.log(`*** Error *** ${err.message}`)}
app.response["log"] = function (err) { console.log(`*** Error *** ${err.message}`) }



/* *********************** (Sezione 1) Middleware ********************* */
// 1. Request log
app.use("/", function (req, res, next) {
    console.log("** " + req.method + " ** : " + req.originalUrl);
    next();
});


// 2 - route risorse statiche
app.use("/", express.static('./static'));


// 3 - routes di lettura dei parametri post
app.use("/", body_parser.json({ "limit": "10mb" }));
app.use("/", body_parser.urlencoded({ "extended": true, "limit": "10mb" }));


// 4 - log dei parametri 
app.use("/", function (req, res, next) {
    if (Object.keys(req.query).length > 0)
        console.log("        Parametri GET: ", req.query)
    if (Object.keys(req.body).length != 0)
        console.log("        Parametri BODY: ", req.body)
    next();
});


// 5. cors accepting every call
const corsOptions = {
    origin: function (origin, callback) {
        return callback(null, true);
    },
    credentials: true
};
app.use("/", cors(corsOptions));


// 6 - binary upload
app.use("/", fileUpload({
    "limits": { "fileSize": (10 * 1024 * 1024) } // 10*1024*1024 // 10 M
}));



/* ***************** (Sezione 2) middleware relativi a JWT ****************** */
// Gestione login
app.post("/api/login", (req, res, next) => {
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
        if (err) {
            res.status(501).send("Errore connessione al database")["log"](err)
        } else {
            const db = client.db(DBNAME)
            const collection = db.collection("mailJWT")
            let username = req.body.username
            collection.findOne({ "username": username }, (err, dbUser) => {
                if (err) {
                    res.status(500).send("Errore esecuzione query")["log"](err)
                } else {
                    if (dbUser) {
                        // non bisogna passare la chiave in chiaro, ma bisogna cifrarla dal client
                        if (req.body.password) {
                            if (bcrypt.compareSync(req.body.password, dbUser.pass)) {
                                // Creo il token
                                let token = creaToken(dbUser)

                                // Salvo il token
                                res.setHeader("authorization", token)
                                res.send({ "ris": "ok" })
                            } else {
                                res.status(401).send("Username o password non validi")["log"](err)
                            }
                        } else {
                            res.status(401).send("Username o password non validi")["log"](err)
                        }

                    } else {
                        res.status(401).send("Username o password non validi")["log"](err)
                    }
                }
            })
        }
    })
})

function creaToken(dbUser) {
    let data = Math.floor((new Date()).getTime() / 1000)
    let payload = {
        "_id": dbUser._id,
        "username": dbUser.username,
        "iat": data,
        "exp": data + DURATA_TOKEN
    }
    return jwt.sign(payload, privateKey)
}

app.use("/", (req, res, next) => {
    let token = readCookie(req)
    if (token != "") {
        // jwt.verify() inietta il payload del token alla funzione di callback
        jwt.verify(token, privateKey, (err, payload) => {
            if (err) {
                res.status(403).send("Unauthorized: token non valido")
            } else {
                let newToken = creaToken(payload)
                writeCookie(res, newToken);
                req["payload"] = payload;
                next()
            }
        })

    } else {
        res.status(403).send("Token assente")
    }
});

function writeCookie(res, token) {
    // / -> risorsa corrente e tutte le risorse del sito
    // httponly -> cookie accessibile solo da http e non da js
    // Secure -> inviato solo su connessioni https
    // SameSite -> stessa cosa del corse. abilita la trasmissione del token anche da pagine che non hanno ricevuto la pagina dallo stesso server
    let cookie = `token=${token};Max-age=${DURATA_TOKEN};Path=/;HttpOnly=true;Secure=true;SameSite=false`
    res.setHeader("Set-Cookie", cookie)
};

function readCookie(req) {
    let token = ""
    if (req.headers.cookie) {
        let cookie = req.headers.cookie.split(';');
        for (let item of cookie) {
            item = item.split('=');
            // trim -> toglie gli spazi davanti e dietro alla stringa
            if (item[0].trim() == "token") {
                token = item[1];
                break;
            }
        }
    }
    return token;
}


/* ********************** (Sezione 3) USER ROUTES  ************************** */

// Logout 
app.use("/api/logout", (req, res, next) => {
    // creo un token vuoto scaduti
    let cookie = `token='';Max-age=-1;Path=/;HttpOnly=true;Secure=true;SameSite=false`
    res.setHeader("Set-Cookie", cookie)
    res.send({ "ris": "ok" })
})

app.use("/api/elencoMail", (req, res, next) => {
    MongoClient.connect(CONNECTION_STRING, (err, client) => {
        if (err) {
            res.status(503).send("Errore connessione database")
        } else {
            const db = client.db(DBNAME)
            const collection = db.collection("mailJWT")
            const _id = req["_id"]
            var oid = new ObjectId(_id)
            let request = collection.findOne({ "_id": oid })
            request.then((data) => {
                res.send(data.mail)
            })
        }
    })
})



/* ***************** (Sezione 4) DEFAULT ROUTE and ERRORS ******************* */
// gestione degli errori
app.use(function (err, req, res, next) {
    console.log(err.stack); // stack completo    
});

// default route
app.use('/', function (req, res, next) {
    res.status(404)
    if (req.originalUrl.startsWith("/api/")) {
        res.send("Risorsa non trovata");
    }
    else res.send(paginaErrore);
});