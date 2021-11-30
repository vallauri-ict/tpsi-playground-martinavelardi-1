import _express from "express";
import * as _http from "http";
import HEADERS from "./headers.json"

let port: number = 1337;
let app = _express();   // = funzione di callback, richiamata ogni volta che arriva una richiesta

let server = _http.createServer(app);

server.listen(port, () => {
    console.log("Server in ascolto sulla porta " + port);
});

// Elenco delle route (listener)
// 1. Metodo di ascolto
// 2. Callback da eseguire in corrispondenza della richiesta

app.use("*", (req, res, next) => {
    console.log(`--> ${req.method}: ${req.originalUrl}`);
    next();
})

app.get("*", (req, res, next) => {
    res.send("This is the response");
})