import * as _http from "http";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";
let port: number = 1337;

let dispatcher: Dispatcher = new Dispatcher();

let server = _http.createServer(function (req, res) {
    dispatcher.dispatch(req, res);
});
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

// Registrazione dei servizi
dispatcher.addListener("POST", "/api/servizio1", function (req, res) {
    res.writeHead(200, HEADERS.json);
    let nome = req["BODY"].nome;
    res.write(JSON.stringify({ "ris": nome, "id": req["GET"].id }));
    res.end();
});
dispatcher.addListener("GET", "/api/servizio2", function (req, res) {
    res.writeHead(200, HEADERS.json);
    let nome = req["GET"].nome;
    res.write(JSON.stringify({ "ris": nome }));
    res.end();
});