import * as _http from "http";
import * as _url from "url";
import * as _fs from "fs";
import * as _mime from "mime";
let HEADERS = require("./headers.json");
let paginaErrore: string;

class Dispatcher {
    prompt: string = ">>> ";
    // Ogni listener è costituito da un json del tipo {"risorsa":"callback"}
    // I listener sono suddivisi in base al tipo di chiamata
    listeners: any = {
        "GET": {},
        "POST": {},
        "DELETE": {},
        "PUT": {},
        "PATCH": {}
    }

    constructor() {
        init();
    }

    addListener(metodo: string, risorsa: string, callback: any) {
        metodo = metodo.toUpperCase();
        // if (this.listeners[metodo]) {}
        if (metodo in this.listeners) {
            this.listeners[metodo][risorsa] = callback;
        }
        else {
            throw new Error("Metodo non valido");
        }
    }

    dispatch(req, res) {
        // Lettura di metodo, risorsa e parametri
        let metodo = req.method;
        let url = _url.parse(req.url, true);
        let risorsa = url.pathname;
        let parametri = url.query;

        console.log(`${this.prompt}${metodo}:${risorsa}${JSON.stringify(parametri)}`);
        if (risorsa.startsWith("/api/")) {
            if (risorsa in this.listeners[metodo]) {
                let _callback = this.listeners[metodo][risorsa];
                // Lancio in esecuzione la callback interna a listeners
                _callback(req, res);
            } else {
                // Il client si aspetta un JSON
                // In caso di errore al posto del JSON si può mandare una stringa
                res.writeHead(404, HEADERS.text);
                res.write("Servizio non trovato");
                res.end();
            }
        } else {
            staticListener(req, res, risorsa);
        }
    }
}
function staticListener(req, res, risorsa) {
    if (risorsa == "/") {
        risorsa = "/index.html";
    }
    let fileName = "./static" + risorsa;
    _fs.readFile(fileName, function (err, data) {
        if (!err) {
            let header ={"Content-Type":_mime.getType(fileName)};
            res.writeHead(200, header);
            res.write(data);
            res.end();
        } else {
            console.log(`           ${err.code}:${err.message}`)
            // Il client aspetta una pagina
            res.writeHead(404, HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    })
}
function init() {
    _fs.readFile("./static/error.html", function (err, data) {
        if (!err) {
            paginaErrore = data.toString();
        } else {
            paginaErrore = "<h1>Pagina non trovata</h1>";
        }
    });
}
module.exports = new Dispatcher();