# :books: Ese01 - createServer :books:

:woman_technologist: __Stud: Velardi Martina__

:school: __IIS Vallauri, 5B inf__

Primo esercizio svolto con l'utilizzo di Node.js. 
Viene realizzato un web server che restituisca al client una pagina HTML contenente tre informazioni: la risorsa richiesta, i parametri passati e il metodo di chiamata.

### createServer
Riceve come parametri
1. Funzione di **callback** eseguita ogni volta che viene ricevuta una richiesta dal server.
    Vengono automaticamente passati due parametri:
    1. **req** (request): messaggio HTTP ricevuto dal client che contiene tutte le informazioni relative alla richiesta.
    2. **res** (responde): il server deve scrivere qui la risposta da restituire al client.
