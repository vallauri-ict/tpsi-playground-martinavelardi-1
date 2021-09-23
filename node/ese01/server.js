
const _http = require("http");
const _url = require("url");
const _colors = require("colors");
const HEADERS = require("./headers.json")
// ""./" --> cartella corrente

const port = 1337;    // porta storica di node js

// crea un web server e restituisce il puntatore. il server non è ancora stato avviato.
// parametri: request e response --> oggetto sul quale il server dovrà andare a scrivere la risposta
const server = _http.createServer(function (req, res) {
    /*
    // intestazione (codice della risposta    risposta testuale)
    res.writeHead(200, HEADERS.text);
    // scrittura della risposta
    res.write("Richesta eseguita correttamente");
    // invio risposta
    res.end();

    console.log("Richiesta eseguita");
    */


    // Lettura di metodo, risorsa e parametri
    let metodo = req.method;
    // parsing della URL ricevuta (trovo risorse e parametri)
    let url = _url.parse(req.url, true);  // true --> voglio parsificare anche i parametri. di default non vengono parsificati
    let risorsa = url.pathname;
    let parametri = url.query;
    
    let dominio = req.headers.host;

    res.writeHead(200, HEADERS.html)
    res.write("<h1> Informazioni relative alla richiesta ricevuta </h1>");
    res.write("<br>");
    res.write(`<p> <b> Risorsa richiesta: </b> ${risorsa} </p>`);
    res.write(`<p> <b> Metodo: </b> ${metodo} </p>`);
    res.write(`<p> <b> Parametri: </b> ${JSON.stringify(parametri)} </p>`);
    res.write(`<p> <b> Dominio richiesto: </b> ${dominio} </p>`);
    res.write("<p> Grazie per la richiesta </p>");
    res.end();
    console.log("Richiesta ricevuta: " + req.url.yellow);

});

// se non si specifica l'indirizzo IP di ascolto il server viene avviato su tutte le interfacce
server.listen(port);    // parte il server in ascolto sulla porta specificata
console.log("server in ascolto sulla porta " + port);