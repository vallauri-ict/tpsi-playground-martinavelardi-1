import express from "express";
import * as fs from "fs";
import * as http from "http";
import * as body_parser from "body-parser";
import { inherits } from "util";
import HEADERS from "./headers.json";
import * as mongodb from "mongodb";
import cors from "cors";

const mongoClient = mongodb.MongoClient;
const CONNECTION_STRING = process.env.MONGODB_URI || "mongodb://admin:admin@cluster0-shard-00-00.zarz7.mongodb.net:27017,cluster0-shard-00-01.zarz7.mongodb.net:27017,cluster0-shard-00-02.zarz7.mongodb.net:27017/test?replicaSet=atlas-bgntwo-shard-0&ssl=true&authSource=admin"
//const CONNECTION_STRING = "mongodb://admin:admin@cluster0-shard-00-00.zarz7.mongodb.net:27017,cluster0-shard-00-01.zarz7.mongodb.net:27017,cluster0-shard-00-02.zarz7.mongodb.net:27017/test?replicaSet=atlas-bgntwo-shard-0&ssl=true&authSource=admin";
const DB_NAME = "recipeBook";


let port: number = parseInt(process.env.PORT) || 1337;
let app = express();

let server = http.createServer(app);

server.listen(port, function () {
  console.log("Server in ascolto sulla porta " + port)

  init();
});
/*
const whitelist = ["https://martinavelardi-crud-server.herokuapp.com/", "http://martinavelardi-crud-server.herokuapp.com/", "https://localhost:1337", "http://localhost:4200"];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin)
      return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    else
      return callback(null, true);
  },
  credentials: true
};
app.use("/", cors(corsOptions));
*/

let paginaErrore = "";
function init() {
  fs.readFile("./static/error.html", function (err, data) {
    if (!err) {
      paginaErrore = data.toString();
    }
    else {
      paginaErrore = "<h2>Risorsa non trovata</h2>";
    }
  });
}


//****************************************************************
//elenco delle routes di tipo middleware
//****************************************************************
// 1.log 
app.use("/", function (req, res, next) {
  console.log("---->" + req.method + ":" + req.originalUrl);
  next();
});

// 2.static route
//il next lo fa automaticamente quando non trova la risorsa
app.use("/", express.static("./static"));

// 3.route lettura parametri post
app.use("/", body_parser.json());
app.use("/", body_parser.urlencoded({ "extended": true }));

// 4.log parametri
app.use("/", function (req, res, next) {
  if (Object.keys(req.query).length > 0) {
    console.log("Parametri GET: ", req.query);
  }
  if (Object.keys(req.body).length > 0) {
    console.log("Parametri BODY: ", req.body);
  }
  next();
})


//****************************************************************
//elenco delle routes di risposta al client
//****************************************************************
// middleware di apertura della connessione
app.use("/", (req, res, next) => {
  mongoClient.connect(CONNECTION_STRING, (err, client) => {
    if (err) {
      res.status(503).send("Db connection error");
    } else {
      console.log("Connection made");
      req["client"] = client;
      next();
    }
  });
});

//lettura delle collezioni presenti nel db
app.get("/api/getCollections", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let request = db.listCollections().toArray();
  request.then((data) => {
    res.send(data);
  });
  request.catch((err) => {
    res.status(503).send("Sintax error in the query");
  });
  request.finally(() => {
    req["client"].close();
  });
});

//middleware di intercettazione dei parametri
let currentCollection = "";
let id = ""
//:id? diventa un campo facoltativo
app.use("/api/:collection/:id?", (req, res, next) => {
  currentCollection = req.params.collection;
  id = req.params.id;
  next();
})

// listener specifici: 
//listener GET
app.get("/api/*", (req, res, next) => {
  let db = req["client"].db(DB_NAME) as mongodb.Db;
  let collection = db.collection(currentCollection);
  if (!id) {
    let request = collection.find(req["query"]).toArray();
    request.then((data) => {
      res.send(data);
    });
    request.catch((err) => {
      res.status(503).send("Sintax error in the query");
    });
    request.finally(() => {
      req["client"].close();
    });
  }
  else {
    let oid = new mongodb.ObjectId(id);
    let request = collection.findOne({ "_id": oid });
    request.then((data) => {
      res.send(data);
    });
    request.catch((err) => {
      res.status(503).send("Sintax error in the query");
    });
    request.finally(() => {
      req["client"].close();
    });
  }

  app.post("/api/*", (req, res, next) => {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    let request = collection.insertOne(req["body"]);
    request.then((data) => {
      res.send(data);
    });
    request.catch((err) => {
      res.status(503).send("Sintax error in the query");
    });
    request.finally(() => {
      req["client"].close();
    });
  })

  app.delete("/api/*", (req, res, next) => {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    let _id = new mongodb.ObjectId(id);
    let request = collection.deleteOne({ "_id": _id });
    request.then((data) => {
      res.send(data);
    });
    request.catch((err) => {
      res.status(503).send("Sintax error in the query");
    });
    request.finally(() => {
      req["client"].close();
    });
  })

  app.patch("/api/*", (req, res, next) => {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    let _id = new mongodb.ObjectId(id);
    let request = collection.updateOne({ "_id": _id }, { "$set": req["body"] });
    request.then((data) => {
      res.send(data);
    });
    request.catch((err) => {
      res.status(503).send("Sintax error in the query");
    });
    request.finally(() => {
      req["client"].close();
    });
  })

  app.put("/api/*", (req, res, next) => {
    let db = req["client"].db(DB_NAME) as mongodb.Db;
    let collection = db.collection(currentCollection);
    let _id = new mongodb.ObjectId(id);
    let request = collection.replaceOne({ "_id": _id }, req["body"]);
    request.then((data) => {
      res.send(data);
    });
    request.catch((err) => {
      res.status(503).send("Sintax error in the query");
    });
    request.finally(() => {
      req["client"].close();
    });
  })


});


//****************************************************************
//default route(risorse non trovate) e route di gestione degli errori
//****************************************************************
app.use("/", function (err, req, res, next) {
  console.log("***************  ERRORE CODICE SERVER ", err.stack, "  *****************");
})



