"use strict"
$(document).ready(function() {
   let _wrapper = $("#wrapper");
    let requestElenco = inviaRichiesta("GET", "/api/elenco");
    requestElenco.fail(errore);
    requestElenco.done(function(elenco){
        for (const notizia of elenco) {
            $('<span>',{
                'class':'titolo',
                'text':notizia.titolo,
            }).appendTo(_wrapper);

            $('<a>',{
                'href':'#',
                'text':' Leggi ',
                'click':function(){
                    let requestDettagli = inviaRichiesta("POST", "/api/dettagli",{"nomeFile":notizia.file})
                    requestDettagli.fail(errore);
                    requestDettagli.done(function(dettagli){
                        $("#news").html(dettagli.file);
                        let requestVisualizzazione = inviaRichiesta("UPDATE", "/api/visualizzazioni", {"fileName":reqNotizia});
                        requestVisualizzazione.fail(errore);
                        requestVisualizzazione.done(function(fatto){
                            
                        })
                    })
                }
            }).appendTo(_wrapper);

            $('<span>',{
                'class':'nVis',
                'text':` [Visualizzato ${notizia.visualizzazioni} volte]`,
            }).appendTo(_wrapper);
            $("<br>").appendTo(_wrapper);
        }
    });
})
