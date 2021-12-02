$(document).ready(() => {

    $("#btnInvia").on("click", () => {
        let request = inviaRichiesta("get", "/api/servizio1", { "nome": "Aurora" });
        request.fail(errore);
        request.done(function (data) {
            alert(JSON.stringify(data));
        });
    });

    $("#btnInvia2").on("click", () => {
        let request = inviaRichiesta("patch", "/api/servizio2", { "nome": "Unico", "vampires": 3 });
        request.fail(errore);
        request.done(function (data) {
            if (data.modifiedCount > 0) {
                alert("Aggiornamento eseguito correttamente");
            } else {
                alert("Nessuna corrispondenza trovata");
            }
        });
    });

    $("#btnInvia3").on("click", () => {
        let request = inviaRichiesta("get", "/api/servizio3/m/brown");
        request.fail(errore);
        request.done(function (data) {
            console.log(JSON.stringify(data));
        });
    });

});
