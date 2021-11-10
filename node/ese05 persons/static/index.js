"use strict"

$(document).ready(function() {
    let _lstNazioni = $("#lstNazioni");
    let _tabStudenti = $("#tabStudenti");
    let _divDettagli = $("#divDettagli");

    _divDettagli.hide();

    

    let request = inviaRichiesta("GET", "/api/nazioni");
    request.fail(errore);
    request.done((data) => {
        console.log(data);

        for (const nation of data.nazioni) {
            $("<a>", {
                "class": "dropdown-item",
                "href": "#",
                "text": nation,
                "click": visualizzaPersone

            }).appendTo(_lstNazioni);
        }
    });


    function visualizzaPersone() {
        let selected_nation = $(this);
        let nation = selected_nation.text();
        console.log(nation);

        

        let request = inviaRichiesta("GET", "/api/persone", {"nazione": nation});
        request.fail(errore);
        request.done((data) => {
            console.log(data);
            _tabStudenti.empty();
            
            _divDettagli.hide();
            for (const person of data) {
                let tr = $("<tr>").appendTo(_tabStudenti);
                for (const key in person) {
                    $("<td>").appendTo(tr).text(person[key]);
                }
                let td = $("<td>").appendTo(tr);
                $("<button>").appendTo(td).text("Dettagli").on("click", dettagli).prop("name", person.name);

                td = $("<td>").appendTo(tr);
                $("<button>").appendTo(td).text("Elimina").prop("name", person.name);
            }

            // :contains pseudoselettore che punta ai button
            // che contengono Elimina al loro interno

            // DELEGATE NOT WORKING
            _tabStudenti.on("click", "button:contains(Elimina)", function() {
                console.log("click elimina");
                let request = inviaRichiesta("DELETE", "/api/elimina", {"person": $(this).prop("name")});
                request.fail(errore);
                request.done(function(data) {
                    alert(data);
                    selected_nation.click();
                });
            })
        });
    }

    function dettagli() {
        let name = $(this).prop("name");
        let request = inviaRichiesta("PATCH", "/api/dettagli", {"person": $(this).prop("name")});
        request.fail(errore);
        request.done(function(data) {
            console.log(data);
            _divDettagli.show(1000);
            _divDettagli.children(".card-img-top").prop("src", data.picture.large);
            _divDettagli.find(".card-title").text(name);
            let s = `<b>Gender: </b>${data.gender}<br>`;
            s += `<b>Address: </b>${JSON.stringify(data.location)}<br>`;
            s += `<b>Address: </b>${data.email}<br>`;
            s += `<b>Address: </b>${JSON.stringify(data.dob)}<br>`;
            _divDettagli.find(".card-text").html(s);
        });
    }
})