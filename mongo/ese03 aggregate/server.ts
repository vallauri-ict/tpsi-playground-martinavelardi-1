import * as _http from "http";
import HEADERS from "./headers.json"
import { Dispatcher } from "./dispatcher"
import * as _mongodb from "mongodb"
const mongoClient = _mongodb.MongoClient
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B";
const DBCOLLECTION = "Orders";

// Query 1
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);

        // .aggregate si aspetta un vettore enumerativo di json
        // i nomi di campi devono essere sempre preceduti dal $ se sono usati come valore (a destra dei : )
        // se sono usati come chiave (a sinistra dei : ) non devo mettere il $

        let req = collection.aggregate([
            { "$match": { "status": "A" } },
            { "$group": { "_id": "$cust_id", "totale": { "$sum": "$amount" } } },
            { "$sort": { "totale": -1 } }
        ]).toArray();

        // dopo aver fatto i gruppi con $group, il recordset risultante avrà solo 2 colonne: "_id" e "totale"

        req.then(function (data) {
            console.log("Query 1", data);
        });
        req.catch(function (err) {
            console.log(`Errore esecuzione query ${err.message}`);
        });
        req.finally(function () {
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 2
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);

        let req = collection.aggregate([
            {
                "$group": {
                    "_id": "$cust_id",
                    "avgAmount": { "$avg": "$amount" },
                    "avgTotal": { "$avg": { "$multiply": ["$qta", "$amount"] } }
                }
            }
        ]).toArray();
        req.then(function (data) {
            console.log("Query 2", data);
        });
        req.catch(function (err) {
            console.log(`Errore esecuzione query ${err.message}`);
        });
        req.finally(function () {
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})
