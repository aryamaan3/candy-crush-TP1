// 1 On définisse une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES est chargée

window.onload = init;

let grille;
let test = 1;

function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)

  grille = new Grille(9, 9);
  grille.showCookies();
}

//https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
let sec = 0;

function pad ( val ) { return val > 9 ? val : "0" + val; }
setInterval( function(){
  $("#seconds").html(pad(++sec%60));
  $("#minutes").html(pad(parseInt(sec/60,10)));
}, 1000);

function pad(val) {
  let valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

