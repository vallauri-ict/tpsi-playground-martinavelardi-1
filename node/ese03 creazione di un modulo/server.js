let modulo = require("modulo.js");
modulo();

let ris = modulo.somma(3, 7);
let ris2 = modulo.moltiplicazione(3, 7);
console.log(ris, ris2);

console.log(modulo.json.nome);
modulo.json.setNome("pluto");
console.log(modulo.json.nome);

console.log(modulo.MyClass.nome);