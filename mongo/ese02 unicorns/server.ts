import * as _http from "http";
import * as _mongodb from "mongodb"
const mongoClient = _mongodb.MongoClient
// Per lavorare in locale:
// const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
// Per lavorare su Atlas (stringa di connessione di nodejs):
const CONNECTIONSTRING="mongodb+srv://admin:admin03@cluster0.duawc.mongodb.net/5B?retryWrites=true&w=majority";
const DBNAME = "5B";
const DBCOLLECTION = "unicorns";

// Query 1 
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        // "$lte": 800, "$gte": 700 --> minore di 800 e maggiore di 700
        collection.find({ "weight": { "$lte": 800, "$gte": 700 } }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 1", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
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
        // $in --> questo E quello
        collection.find({
            "$and":
                [
                    { "gender": "m" },
                    { "loves": { "$in": ["grape", "apple"] } },
                    { "vampires": { "$gt": 60 } }
                ]
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 2", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 3 
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        collection.find({
            "$or":
                [
                    { "gender": "f" },
                    { "weight": { "$lte": 700 } },
                ]
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 3", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 4 
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        collection.find({
            "$and": [
                { "loves": { "$in": ["apple", "grape"] } },
                { "vampires": { "$gte": 60 } }
            ]
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 4", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 5 
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        // $all --> SIA questo SIA quello
        collection.find({
            "loves": { "$all": ["grape", "watermelon"] }
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 5", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 6a
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        collection.find({
            "$or":
                [
                    { "hair": "brown" },
                    { "hair": "grey" },
                ]
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 6a", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 6b
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        collection.find({
            "hair": { "$in": ["brown", "grey"] }
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 6b", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 7
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        collection.find({
            "$and": [
                { "vaccinated": { "$exists": true } },
                { "vaccinated": true }
            ]
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 7", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 9
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        let regex = new RegExp("^A", "i"); // i --> sia maiuscola che minuscola
        collection.find({
            "$and": [
                { "name": { "$regex": regex } },
                { "gender": "f" }
            ]
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 9", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 10
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        // devo mettere _mongodb altrimenti dà errore
        collection.find({
            "_id": new _mongodb.ObjectId('618239653acd4315eef2b6ca')
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 10", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// ********* projection --> per filtrare i campi **********

// Query 11
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        // "campo": 1 --> mostro il campo
        // _id: 0 --> nascondo l'id
        collection.find({
            "gender": "m"
        }).project({
            "name": 1,
            "vampires": 1,
            "_id": 0
        }
        ).toArray(function (err, data) {
            if (!err) {
                console.log("Query 11", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 11b
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        // .sort
        // -1 --> decrescente
        // 1 --> crescente
        collection.find({
            "gender": "m"
        }).project({
            "name": 1,
            "vampires": 1,
            "_id": 0
        }).sort({
            "vampires": -1,
            "name": 1
        }).toArray(function (err, data) {
            if (!err) {
                console.log("Query 11b", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 11c
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        // .limit(n) --> per vedere solo i primi n risultati
        // .skip(n) --> toglie i primi n risultati. viene sempre fatto prima
        collection.find({
            "gender": "m"
        }).project({
            "name": 1,
            "vampires": 1,
            "_id": 0
        }).sort({
            "vampires": -1,
            "name": 1
        }).skip(1).limit(3).toArray(function (err, data) {
            if (!err) {
                console.log("Query 11c", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 12
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        // .count() --> conta i risultati
        collection.find({
            "weight": { "$gt": 500 }
        }).count(function (err, data) {
            if (!err) {
                console.log("Query 12", data);
            }
            else {
                console.log(`Errore esecuzione query ${err.message}`);
            }
            client.close();
        });
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 13
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        console.log(err);
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            collection.findOne({
                "name": "Aurora"
            }, { "projection": { "weigth": 1, "hair": 1 } }, (err, data) => {
                if (!err) {
                    console.log("Query 13", data);
                }
                else {
                    console.log(`Errore esecuzione query ${err.message}`);
                }
                client.close();
            })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 14
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        console.log(err);
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            collection.distinct(
                "loves", {
                "gender": "f"
            }, (err, data) => {
                if (!err) {
                    console.log("Query 14", data);
                }
                else {
                    console.log(`Errore esecuzione query ${err.message}`);
                }
                client.close();
            })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 15
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        console.log(err);
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            collection.insertOne({
                "name": "Pippo",
                "gender": "m",
                "loves": ["apple", "lemon"]
            }, (err, data) => {
                if (!err) {
                    console.log("Query 15", data);

                    // cancello tutti i record che matchano col filtro
                    collection.deleteMany({ "name": "Pippo" }, (err, data) => {
                        if (!err) {
                            console.log("Query 15b", data);
                        } else {
                            console.log(`Errore esecuzione query ${err.message}`);
                        }
                        // Da fare nella query più interna, altrimenti trova la connessione chiusa e va in errore
                        client.close();
                    })
                }
                else {
                    console.log(`Errore esecuzione query ${err.message}`);
                }
            })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 16
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        console.log(err);
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            // {"upsert": true} --> se il record non esiste viene automaticamente creato
            collection.updateOne({
                "name": "Pilot"
            },
                {
                    "$inc": { "vampires": 1 }
                }, { "upsert": true },
                (err, data) => {
                    if (!err) {
                        console.log("Query 16", data);
                    }
                    else {
                        console.log(`Errore esecuzione query ${err.message}`);
                    }
                    client.close();
                })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 17
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        console.log(err);
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            collection.updateOne(
                { "name": "Aurora" },
                {
                    "$addToSet": { "loves": "carrot" },
                    "$inc": { "weight": 10 }
                }, (err, data) => {
                    if (!err) {
                        console.log("Query 17", data);
                    }
                    else {
                        console.log(`Errore esecuzione query ${err.message}`);
                    }
                    client.close();
                })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 18
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            // {"upsert": true} --> se il record non esiste viene automaticamente creato
            collection.updateOne(
                { "name": "Minnie" },
                { "$inc": { "vampires": 1 } },
                { "upsert": true },
                (err, data) => {
                    if (!err) {
                        console.log("Query 18", data);
                    }
                    else {
                        console.log(`Errore esecuzione query ${err.message}`);
                    }
                    client.close();
                })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 19
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            collection.updateMany(
                { "vaccinated": { "$exists": false } },
                { "$set": { "vaccinated": true } },
                (err, data) => {
                    if (!err) {
                        console.log("Query 19", data);
                    }
                    else {
                        console.log(`Errore esecuzione query ${err.message}`);
                    }
                    client.close();
                })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 20
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            collection.deleteMany(
                { "loves": { "$all": ['grape', 'carrot'] } },
                (err, data) => {
                    if (!err) {
                        console.log("Query 20", data);
                    }
                    else {
                        console.log(`Errore esecuzione query ${err.message}`);
                    }
                    client.close();
                })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 21
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            // .find --> deve essere il primo
            // .toArray --> deve essere l'ultimo
            // .findOne --> non è consentito fare .project
            //      si usa {"projection":""} dopo il filtro
            collection.find({ "gender": "f" })
                .sort({ "vampires": -1 })
                .limit(1)
                .project({ "name": 1, "vampires": 1, "_id": 0 })
                .toArray(
                    (err, data) => {
                        if (!err) {
                            console.log("Query 21", data);
                        }
                        else {
                            console.log(`Errore esecuzione query ${err.message}`);
                        }
                        client.close();
                    })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 21b
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            // .findOne --> non è consentito fare .project
            //      si usa {"projection":""} dopo il filtro
            collection.find({ "gender": "f" },
                { "projection": { "name": 1, "vampires": 1, "_id": 0 } })
                .sort({ "vampires": -1 })
                .limit(1)
                .toArray(
                    (err, data) => {
                        if (!err) {
                            console.log("Query 21b", data);
                        }
                        else {
                            console.log(`Errore esecuzione query ${err.message}`);
                        }
                        client.close();
                    })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 22
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        if (!err) {
            let db = client.db(DBNAME);
            let collection = db.collection(DBCOLLECTION);
            // Devo sempre mettere il name, altrimenti viene perso
            // .replaceOne --> cancella tutti i campi del record trovato tranne l'id (non modificabile)
            // lo uso quando voglio mantenere il record
            collection.replaceOne({
                "name": "Pluto",
                "residenza": "Fossano",
                "loves": ["apple"]
            },
                (err, data) => {
                    if (!err) {
                        console.log("Query 22", data);
                    }
                    else {
                        console.log(`Errore esecuzione query ${err.message}`);
                    }
                    client.close();
                })
        }
    }
    else {
        console.log(`Errore di connessione al database ${err.message}`);
    }
})

// Query 1 promise
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
    if (!err) {
        let db = client.db(DBNAME);
        let collection = db.collection(DBCOLLECTION);
        let req = collection.find({ "weight": { "$lte": 800, "$gte": 700 } }).toArray();
        req.then(function (data) {
            console.log("Query 1 promise", data);
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
