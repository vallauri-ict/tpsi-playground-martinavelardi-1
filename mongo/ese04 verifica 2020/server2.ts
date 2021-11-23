import * as _http from "http";
import HEADERS from "./headers.json"
import { Dispatcher } from "./dispatcher"
import * as mongodb from "mongodb";
const mongoClient = mongodb.MongoClient;
const CONNECTIONSTRING = "mongodb://127.0.0.1:27017";
const DBNAME = "5B"
const DBCOLLECTION = "vallauri";

let port: number = 1337;

let dispatcher: Dispatcher = new Dispatcher();

let server = _http.createServer(function (req, res) {
  dispatcher.dispatch(req, res);
})
server.listen(port);
console.log("Server in ascolto sulla porta " + port);

// Query 2
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection(DBCOLLECTION);
    collection.aggregate([{
      $project: {
        mIta: { $avg: "$italiano" },
        mSis: { $avg: "$sistemi" },
        mInf: { $avg: "$informatica" },
        mMat: { $avg: "$matematica" },
        classe: 1,
      },
    },
    {
      $project: {
        mediaMaterie: {
          $avg: ["$mIta", "$mSis", "$mInf", "$mMat"],
        },
        classe: 1,
      },
    },
    {
      $group: {
        _id: "$classe",
        mediaClasse: { $avg: { $round: ["$mediaMaterie", 2] } },
      },
    }])
      .project({ "nome": 1, "classe": 1 })
      .toArray((err, data) => {
        if (!err) {
          console.log(`Query 2`, data)
        } else {
          console.log(`Errore esecuzione query ${err.message}`)
        }
        client.close();
      });
  } else {
    console.log(`Errore connessione al db: ${err.message}`);
  }
});

// Query 3
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection(DBCOLLECTION);
    let req = collection.updateMany(
      { "genere": "f", "classe": "4A" },
      { "$push": { "informatica": 7 as never } }
    )
    req.then((data) => {
      console.log(`Query 3`, data)
    });
    req.catch((err) => {
      console.log(`Errore esecuzione query ${err.message}`)
    })
    req.finally(() => {
      client.close();
    })
  } else {
    console.log(`Errore connessione al db: ${err.message}`);
  }
});

// Query 4
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection(DBCOLLECTION);
    let req = collection.deleteMany(
      { "classe": "3B", "sistemi": { "$in": [3] } },
    )
    req.then((data) => {
      console.log(`Query 4`, data)
    });
    req.catch((err) => {
      console.log(`Errore esecuzione query ${err.message}`)
    })
    req.finally(() => {
      client.close();
    })
  } else {
    console.log(`Errore connessione al db: ${err.message}`);
  }
});

// Query 5
mongoClient.connect(CONNECTIONSTRING, (err, client) => {
  if (!err) {
    let db = client.db(DBNAME);
    let collection = db.collection(DBCOLLECTION);
    let req = collection.aggregate([
      { "$group": { "_id": "$classe", "totAssenze": { "$sum": "$assenze" } } },
      { "$sort": { "totAssenze": -1 } }]).toArray()
    req.then((data) => {
      console.log(`Query 5`, data)
    });
    req.catch((err) => {
      console.log(`Errore esecuzione query ${err.message}`)
    })
    req.finally(() => {
      client.close();
    })
  } else {
    console.log(`Errore connessione al db: ${err.message}`);
  }
});