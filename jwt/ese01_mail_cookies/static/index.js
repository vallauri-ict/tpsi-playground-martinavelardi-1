"use strict"
$(document).ready(function () {

    let _btnInvia = $("#btnInvia");
    let _btnLogout = $("#btnLogout");

    _btnInvia.on("click", function () {
        let mail = {
            "to": $("#txtTo").val(),
            "subject": $("#txtSubject").val(),
            "message": $("#txtMessage").val()
        }
        let newMailRQ = inviaRichiesta('POST', '/api/newMail', mail);
        newMailRQ.done(function (data) {
            console.log(data);
            alert("Mail inviata correttamente");
        });
        newMailRQ.fail(errore)
    });

    _btnLogout.on("click", function () {
        let request = inviaRichiesta('POST', '/api/logout', mail)
        request.done((data) => {
            alert("Logout eseguito correttamente")
            window.location.href = "login.html"
        })
        request.fail(errore)
    })

});