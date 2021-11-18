import * as _http from "http" 
import * as _url from "url" 
import * as _fs from "fs" 
import * as _mime from "mime" 
import * as _querystring from "query-string"
import { callbackify, inherits } from "util"
import HEADERS from "./headers.json"
let paginaErrore : string ;

export class Dispatcher{
    prompt:string = ">>> "
    //ogni listener è costituito da un json del tipo
    // {"risorsa":"callback"}
    // I listener sono suddivisi in base al metodo di chiamata
    listeners:any = {
        "GET":{},
        "POST":{},
        "DELETE":{},
        "PUT":{},
        "PATCH":{}
    }

    constructor(){
        init();
    }

    addListener(metodo:string, risorsa:string, callback:any){
        metodo = metodo.toUpperCase();
        /* if(this.listeners[metodo]){}*/
        if (metodo in this.listeners) {
            this.listeners[metodo][risorsa]= callback;
        }
        else{
            throw new Error("metodo non valido");
        }
    }
    dispatch(req, res){
        let metodo = req.method.toUpperCase();
        if(metodo == "GET"){
            this.innerDispatch(req, res);
        }
        else{
            let parametriBody : string = "";
            req.on("data", function(data){
                parametriBody += data;
            })
            let parametriJson = {};
            //parsifico i parametri presenti nel body
            let _this = this;
            req.on("end", function(){
                try{
                    // parametri Json
                    parametriJson = JSON.parse(parametriBody);
                }
                catch(error){
                    //parametri urlencoded
                    parametriJson = _querystring.parse(parametriBody);
                }
                finally{
                    //il chiamante li potrà ottenere
                    req["BODY"] = parametriJson;
                    //puntatore alla classe "this" si riferisce a req
                    _this.innerDispatch(req, res);
                }
            })
        }
    }

    innerDispatch(req, res){
        //Lettura di metodo risorsa e parametri
       let metodo = req.method; 
       let url = _url.parse(req.url, true);
       let risorsa = url.pathname;
       let parametri = url.query;
    
       req["GET"] = parametri;
    
       
       console.log(`${this.prompt} ${metodo} : ${risorsa} ${JSON.stringify(parametri)}`);
       if(req["BODY"]){
          console.log(`    ${JSON.stringify(req["BODY"])}`);
       }


       if (risorsa.startsWith("/api/")) {
           if(risorsa in this.listeners[metodo]){
               let _callback = this.listeners[metodo][risorsa];
               //lancio in esecuzione la callback interna a listeners
               _callback(req, res);
           }
           else{
               // Il client si aspetta un JSON 
               // in caso di errore al posto del JSON
               // restituiamo una stringa
               res.writeHead(404, HEADERS.text);
               res.write("servizio non trovato");
               res.end();
           }
       }
       else{
           staticListener(req, res, risorsa);
       }
    }
}



function staticListener(req, res, risorsa){
    if(risorsa == "/"){
        risorsa = "/index.html";
    }
    //risorsa incomincia sempre per "/"
    let fileName = "./static"+risorsa;
    _fs.readFile(fileName, function(err, data){
        if(!err){
            let header = {"Content-Type": _mime.getType(fileName)};
            res.writeHead(200,header);
            res.write(data);
            res.end();
        }
        else{
            console.log(`        ${err.code} : ${err.message}`);
            //Il client si aspetta una pagina
            res.writeHead(404,HEADERS.html);
            res.write(paginaErrore);
            res.end();
        }
    });
}

function init(){
    _fs.readFile("./static/error.html", function(err, data){
       if(!err){
           paginaErrore = data.toString();
       }
       else{
           paginaErrore = "<h1>Pagina non trovata</h1>";
       }
    });
}

//module.exports = new Dispatcher();