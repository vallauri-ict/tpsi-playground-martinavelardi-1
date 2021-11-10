import * as http from "http";


import {HEADERS} from "./headers";
import {PERSONS} from "./persons";
import {Dispatcher} from "./dispatcher";

let dispatcher:Dispatcher = new Dispatcher();

const PORT:number = 1337;

let server = http.createServer((req:any, res:any) => {
    dispatcher.dispatch(req, res);
});

server.listen(PORT);
console.log("Server in ascolto sulla porta " + PORT);

// _________________________________________
// ******* registrazione dei servizi *******
// _________________________________________
dispatcher.addListener("GET", "/api/nazioni", (req, res) => {
    res.writeHead(200, HEADERS.json);

    let nazioni = [];
    for (const person of PERSONS.results) {
        if (!nazioni.includes(person.location.country)) {
            nazioni.push(person.location.country);
        }
    }
    nazioni.sort();
    res.end(JSON.stringify({
        "nazioni": nazioni
    }));
});

dispatcher.addListener("GET", "/api/persone", (req, res) => {
    let nazione:string = req["GET"].nazione;
    
    let personsArr:object[] = [];
    for (const person of PERSONS.results) {
        if (person.location.country == nazione) {
            let personJson:object = {
                "name": person.name.title + " " + person.name.first + " " + person.name.last,
                "city": person.location.city,
                "state": person.location.state,
                "cell": person.cell
            };
            personsArr.push(personJson);
        }
    }

    res.writeHead(200, HEADERS.json);
    res.end(JSON.stringify(personsArr));
});

dispatcher.addListener("PATCH", "/api/dettagli", (req, res) => {
    let personReq = req["BODY"].person;
    let trovato = false;
    let person;
    for (person of PERSONS.results) {
        if ((person.name.title + " " + person.name.first + " " + person.name.last) == personReq) {
            trovato = true;
            break;
        }
    }
    if (trovato) {
        res.writeHead(200, HEADERS.json);
        res.end(JSON.stringify(person));
    } else {
        res.writeHead(404, HEADERS.text);
        res.end("Persona non trovata");
    }
});

dispatcher.addListener("DELETE", "/api/elimina", (req, res) => {
    let personReq = req["BODY"].person;
    let trovato = false;
    let i;
    PERSONS.results[i]
    for (i = 0; i < PERSONS.results.length; i++) {
        if ((PERSONS.results[i].name.title + " " + PERSONS.results[i].name.first + " " + PERSONS.results[i].name.last) == personReq) {
            trovato = true;
            break;
        }
    }
    if (trovato) {
        PERSONS.results.splice(i, 1);
        res.writeHead(200, HEADERS.json);
        res.end(JSON.stringify("Eliminato correttamente"));
    } else {
        res.writeHead(404, HEADERS.text);
        res.end("Persona" + personReq +" non trovata");
    }
});