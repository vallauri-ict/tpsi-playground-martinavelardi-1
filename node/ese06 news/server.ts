import * as _http from "http";
import {HEADERS} from "./headers";
import {Dispatcher} from "./dispatcher";
import notizie from "./notizie.json";
import { read } from "fs";
let port : number = 1337;

let dispatcher :Dispatcher = new Dispatcher();

let server = _http.createServer(function(req, res){
    dispatcher.dispatch(req, res);
})
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

//Registrazione del servizio 
dispatcher.addListener("GET", "/api/elenco", function(req, res){
    res.writeHead(200,HEADERS.json); 
    res.write(JSON.stringify(notizie));
    res.end();
});

dispatcher.addListener("POST", "/api/dettagli", function(req, res){
    let reqNotizia = req["BODY"].nomeFile;
    let corpoNotizia = {"file":""};
    const fs = require('fs');
    fs.readFile(`./news/${reqNotizia}`, 'utf8' , function(err, data){
        if (err) {
            console.error(err);
            return;
        }
        res.writeHead(200,HEADERS.json);
        corpoNotizia.file = data;
        res.write(JSON.stringify(corpoNotizia));
        res.end();   
    })
});

dispatcher.addListener("UPDATE", "/api/visualizzazioni", function(req, res){
    let reqNotizia = req["BODY"].fileName;
    
    res.writeHead(200,HEADERS.text); 
    res.write(JSON.stringify(""));
    res.end();
});
