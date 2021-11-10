import * as _fs from "fs";
import HEADERS from "./headers.json";
import { Dispatcher } from "./dispatcher";

// Lettura file radios.json (import)
import radios from "./radios.json";
import { json } from "node:stream/consumers";

// Lettura file states.json (readFile)
_fs.readFile("./states.json", function (err, data) {
    if (err) {
        console.error(err);
        return;
    } else {
        // data è il contenuto del file espresso in forma binaria
        // se il file è un file di testo è NECESSARIO eseguire un .toString() finaleF
        // console.log(data.toString());
        elabora(JSON.parse(data.toString()));
    }
})
function elabora(states) {
    for (const state of states) {
        for (const radio of radios) {
            if (radio.state == state.value) {
                state.stationcount = parseInt(state.stationcount) + 1;
                state.stationcount = (state.stationcount).toString();
            }
        }
    }
    _fs.writeFile("./states.json", JSON.stringify(states), function (err) {
        if (err) {
            console.error(err);
            return;
        } else {
            console.log("File salvato correttamente");
        }
    })
}