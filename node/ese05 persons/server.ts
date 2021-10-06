import * as _http from "http";
let HEADERS = require("./headers.json");
let dispatcher = require("./dispatcher.ts");
let persons = require("./persons.json");
let port: number = 1337;

let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

// ******************** Registrazione dei servizi ********************
dispatcher.addListener("GET", "/api/Nazioni", function (req, res) {
    res.writeHead(200, HEADERS.json);
    let nazioni = [];
    for (const person of persons["results"]) {
        if (!nazioni.includes(person.location.country)) {
            // per aggiungere una voce al vettore enumerativo
            nazioni.push(person.location.country);
        }
    }

    // Ordino il vettore
    nazioni.sort();
    res.write(JSON.stringify({ "nazioni": nazioni }));
    res.end();
});