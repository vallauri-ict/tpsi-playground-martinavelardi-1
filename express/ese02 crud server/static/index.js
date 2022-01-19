"use strict"

$(document).ready(function() {
  let filter = $(".card").first();
  let divIntestazione = $("#divIntestazione")
  let divCollections = $("#divCollections")
  let table = $("#mainTable")
  let divDettagli = $("#divDettagli")
  let currentCollection = "";

  filter.hide();

  let request = inviaRichiesta("get", "/api/getCollections");
  request.fail(errore)
  request.done(function(collections) {
    //console.log(collections);
    let label = divCollections.children("label");
    for (const collection of collections) {
      let clone = label.clone();
      clone.appendTo(divCollections);
      clone.children("input").val(collection.name);
      clone.children("span").text(collection.name);
      divCollections.append("<br>");
    }
    label.remove();
  })

  divCollections.on("click","input[type=radio]",function(){
    currentCollection = $(this).val();
    let request = inviaRichiesta("GET", "/api/"+currentCollection)
    request.fail(errore);
    request.done(disegnaTabella)
  });
  
  function disegnaTabella(data){
      divIntestazione.find("strong").eq(0).text(currentCollection);
      divIntestazione.find("strong").eq(1).text(data.length);
      if(currentCollection == "unicorns"){
        filter.show();
      }
      else
      {
        filter.hide();
      }
      table.children("tbody").empty();
      for (const item of data) {
        let tr = $("<tr>");
        tr.appendTo(table.children("tbody"));

        let td = $("<td>");
        td.appendTo(tr);
        td.text(item._id);
        td.prop("_id",item._id);
        td.prop("method","get");
        td.on("click", visualizzaDettagli)
        
        td = $("<td>");
        td.appendTo(tr);
        td.text(item.name);
        td.prop("_id",item._id);
        td.prop("method","get");
        td.on("click", visualizzaDettagli)

        td = $("<td>");
        td.appendTo(tr);

        $("<div>").appendTo(td).prop({"_id":item._id , "method":"patch"}).on("click",visualizzaDettagli); 
        
        $("<div>").appendTo(td).prop({"_id":item._id , "method":"put"}).on("click",visualizzaDettagli); 
        
        $("<div>").appendTo(td).prop("_id",item._id).on("click",elimina);
      }
    };

  function elimina(){
    let request = inviaRichiesta("delete","/api/"+currentCollection +"/"+$(this).prop("_id"));
    request.fail(errore);
    request.done(function(){
      alert("documento rimosso correttamente");
      aggiorna();
    })

  }

  function visualizzaDettagli(){
    let method = $(this).prop("method").toUpperCase();
    let id = $(this).prop("_id");
    let request = inviaRichiesta("GET","/api/"+currentCollection +"/"+id)
    request.fail(errore);
    request.done(function(data){
      console.log(data);
      if(method == "GET"){
        let content = "";
        for (const key in data) {
          content += "<strong>"+ key +"</strong> : " + data[key] + "<br>";
          divDettagli.html(content);
        }
      }
      else{
        divDettagli.empty();
        let txtArea = $("<textarea>");
        //rimuoviamo id perché non deve essere cambiato 
        delete(data._id);
        txtArea.val(JSON.stringify(data, null, 2));
        txtArea.appendTo(divDettagli);
        //ridimensionamento della textarea in base al contenuto
        //ScrollHeight è una property js che restituisce l'altezza della textarea
        //  sulla base del contenuto
        txtArea.css("height",txtArea.get(0).scrollHeight);
        console.log(txtArea.get(0).scrollHeight);
        visualizzaBtnInvia(method, id);
      }
    })
  }

  function visualizzaBtnInvia(method, id=""){
    let btnInvia = $("<button>");
    btnInvia.text("INVIA");
    btnInvia.appendTo(divDettagli);
    btnInvia.on("click", function(){
      let param = "";
      try{
        param = JSON.parse(divDettagli.children("textarea").val());
      }
      catch{
        alert("Errore: Json non valido");
        return;
      }

      let request = inviaRichiesta(method, "/api/"+currentCollection+"/"+id, param);
      request.fail(errore);
      request.done(function(){
        alert("operazione eseguita correttamente");
        divDettagli.empty();    
        aggiorna();
      });
    })
  }

  $("#btnAdd").on("click", function(){
    divDettagli.empty();
    let txtArea = $("<textarea>");
    txtArea.val("{ }");
    txtArea.appendTo(divDettagli);
    visualizzaBtnInvia("POST");
  });

  function aggiorna(){
    //divCollections.trigger("click","input[type=radio]");
    var event = jQuery.Event('click');
    event.target = divCollections.find('input[type=radio]:checked')[0];
    divCollections.trigger(event);
    divDettagli.empty();
  }

  $("#btnFind").on("click", function(){
		let filterJson = {}
		let hair = $("#lstHair").children("option:selected").val()
		if (hair)
      filterJson["hair"]=hair.toLowerCase();
		
		let male = filter.find("input[type=checkbox]").first()
				.is(":checked")
		let female = filter.find("input[type=checkbox]").last()
				.is(":checked")
		if(male && !female)
      filterJson["gender"]='m';
		else if(female && !male)
      filterJson["gender"]='f';
		
		let request = inviaRichiesta("get", "/api/" + currentCollection, filterJson)
		request.fail(errore)
		request.done(disegnaTabella)

	})
});

