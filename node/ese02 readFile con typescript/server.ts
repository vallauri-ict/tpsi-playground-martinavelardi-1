"use strict"

import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
// Non è una libreria nativa quindi la devo installare (npm install mime, npm install @types/mime)
import * as _mime from "mime";

const HEADERS = require("./headers.json");

// Posso tipizzare le variabili, non è obbligatorio
const PORT: number = 1337;
let paginaErrore: string;

var server = _http.createServer(function (req, res) {
    // Lettura di metodo, risorsa e parametri
    let metodo = req.method;
    let url = _url.parse(req.url, true);
    let risorsa = url.pathname;
    let parametri = url.query;
    console.log(`Richiesta: ${metodo}:${risorsa}, param: ${JSON.stringify(parametri)}`);


    if (risorsa == "/") {
        risorsa = "/index.html";
    }

    // Se la risorsa non è un servizio. È una pagina
    if (!risorsa.startsWith("/api/")) {
        risorsa = "./static" + risorsa;
        // Metodo asincrono
        _fs.readFile(risorsa, function (error, data) {
            if (!error) {
                // quando getType non funziona, usare lookup
                let header = { "Content-Type": _mime.getType(risorsa) }
                res.writeHead(200, header);
                res.write(data);
                res.end();
            }
            else {
                res.writeHead(404, HEADERS.html);
                res.write(paginaErrore);
                res.end();
            }
        })
    }
    else if (risorsa == "/api/servizio1") {
        // Gestione servizio1
        let json = { "ris": "ok" }
        res.writeHead(200, HEADERS.json);
        // Da passare obbligatoriamente un json quando mando 200
        res.write(JSON.stringify(json));
        res.end();
    }
    else {
        // .text è default, posso non metterlo
        res.writeHead(404, HEADERS.text);
        res.write("Servizio inesistente");
        res.end();
    }
});

server.listen(PORT, function () {
    _fs.readFile("./static/error.html", function (errore, data) {
        if (!errore) {
            paginaErrore = data.toString();
        }
        else {
            paginaErrore = "<h1> Pagina non trovata </h1>";
        }
    })
});
console.log("Server in esecuzione! Porta: " + PORT);