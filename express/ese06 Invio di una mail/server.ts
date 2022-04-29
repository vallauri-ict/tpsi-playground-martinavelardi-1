import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import { inherits } from "util";
import * as mongodb from "mongodb";
import cors from "cors";
import nodemailer from "nodemailer"
import ENVIRONMENT from "./environment.json"

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = process.env.MONGODB_URI || "mongodb://admin:admin@cluster0-shard-00-00.zarz7.mongodb.net:27017,cluster0-shard-00-01.zarz7.mongodb.net:27017,cluster0-shard-00-02.zarz7.mongodb.net:27017/test?replicaSet=atlas-bgntwo-shard-0&ssl=true&authSource=admin"
//const CONNECTION_STRING = "mongodb://admin:admin@cluster0-shard-00-00.zarz7.mongodb.net:27017,cluster0-shard-00-01.zarz7.mongodb.net:27017,cluster0-shard-00-02.zarz7.mongodb.net:27017/test?replicaSet=atlas-bgntwo-shard-0&ssl=true&authSource=admin";
const DB_NAME = "recipeBook";


let port: number = parseInt(process.env.PORT) || 1337;
let app = express();

let server = http.createServer(app);

server.listen(port, function () {
  console.log("Server in ascolto sulla porta " + port)

  init();
});

let message = ""
let paginaErrore = "";

function init() {
  fs.readFile("./static/error.html", function (err, data) {
    if (!err) {
      paginaErrore = data.toString();
    }
    else {
      paginaErrore = "<h2>Risorsa non trovata</h2>";
    }
  });

  fs.readFile("./static/error.html", function (err, data) {
    if (!err) {
      paginaErrore = data.toString();
    }
  });
}


//****************************************************************
//elenco delle routes di tipo middleware
//****************************************************************
// 1.log 
app.use("/", function (req, res, next) {
  console.log("---->" + req.method + ":" + req.originalUrl);
  next();
});

// 2.static route
//il next lo fa automaticamente quando non trova la risorsa
app.use("/", express.static("./static"));

// 3.route lettura parametri post
app.use("/", body_parser.json());
app.use("/", body_parser.urlencoded({ "extended": true }));

// 4.log parametri
app.use("/", function (req, res, next) {
  if (Object.keys(req.query).length > 0) {
    console.log("Parametri GET: ", req.query);
  }
  if (Object.keys(req.body).length > 0) {
    console.log("Parametri BODY: ", req.body);
  }
  next();
})


//****************************************************************
// elenco delle routes di risposta al client
//****************************************************************
let transporter = nodemailer.createTransport({ "service": "gmail", "auth": { "user": ENVIRONMENT.MAILCREDENTIALS } })
app.post("/api/newMail", (req, res, next) => {
  let msg = message.replace("__user", "pippo").replace("__password", "pippo")
  let mailOption = { "from": ENVIRONMENT.MAILCREDENTIALS.user, "to": req.body.to, "subject": req.body.subject, "html": msg, "attachments": [{ "filename": "qrcode.png", "path": "./qrCode.png" }] }
  transporter.sendMail(mailOption, (err, data) => {
    if (!err) {
      console.log("ok")
      res.send({ "ris": "ok" })
    } else {
      res.status(500).send("Errore invio email" + err.message)
    }
  })
})

//****************************************************************
//default route(risorse non trovate) e route di gestione degli errori
//****************************************************************
app.use("/", function (err, req, res, next) {
  console.log("***************  ERRORE CODICE SERVER ", err.stack, "  *****************");
})



