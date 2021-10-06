"use strict"
$(document).ready(function () {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");

    _divDettagli.hide();

    let requestNazioni = inviaRichiesta("GET", "/api/Nazioni");
    requestNazioni.fail(errore);
    requestNazioni.done(function (data) {
        console.log(data);
    })
})