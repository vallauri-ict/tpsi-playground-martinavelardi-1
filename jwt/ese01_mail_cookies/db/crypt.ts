// ts-node crypt.ts

import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs"

const DBNAME = "5B"
const CONNECTIONSTRING = "mongodb+srv://admin:admin03@cluster0.duawc.mongodb.net/5B?retryWrites=true&w=majority";


let cnt = 0;
MongoClient.connect(CONNECTIONSTRING, function (err, client) {
	if (err)
		console.log("Errore di connessione al database");
	else {
		const DB = client.db(DBNAME);
		const COLLECTION = DB.collection('mailJWT');

		COLLECTION.find().project({ "password": 1 }).toArray(function (err, vet) {
			if (err) {
				console.log("Errore esecuzione query" + err.message)
				client.close();
			}
			else {
				for (let item of vet) {
					let oid = new ObjectId(item["_id"]);
					// se lancio una seconda volta lo script NON DEVE FARE NULLA
					// le stringhe bcrypt inizano con $2[ayb]$ e sono lunghe 60
					let regex = new RegExp("^\\$2[ayb]\\$.{56}$");
					// se la password corrente non è in formato bcrypt
					if (!regex.test(item["password"])) {
						console.log("aggiornamento in corso ... ", item);
						let password = bcrypt.hashSync(item["password"], 10)
						COLLECTION.updateOne({ "_id": oid },
							{ "$set": { "password": password } },
							function (err, data) {
								if (err)
									console.log("errore aggiornamento record",
										item["_id"], err.message)
								else
									aggiornaCnt(vet.length, client)
							})
					}
					else
						aggiornaCnt(vet.length, client)
				}
				// aggiornaCnt(vet.length)  NOK !!
			}
		});
	}
});


function aggiornaCnt(length, client) {
	cnt++;
	if (cnt == length) {
		console.log("Aggiornamento eseguito correttamente")
		client.close();
	}
}