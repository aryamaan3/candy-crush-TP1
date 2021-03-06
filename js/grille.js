/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {

  nbLignes; 
  nbColonnes;
  tabCookies = [];
  cookiesCliquees = [0, 0];
  score = 0;

  constructor(l, c) {
    this.nbLignes = l;
    this.nbColonnes = c;
    this.remplirTableauDeCookies(6);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {


      let ligne = Math.floor(index/this.nbLignes);
      let colonne = index % this.nbColonnes;
      let cookie = this.tabCookies[ligne][colonne];
      let img = cookie.htmlImage;

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);

      div.addEventListener("dragover", function(event) {
        event.preventDefault();
      }, false);
      
      // si cookie cliqué
      div.addEventListener("click", 
       () => {
         //si premier cookie cliqué
        if (!this.cookiesCliquees[0]){ 
          cookie.selectionnee();
          this.cookiesCliquees = [cookie, 0];
        }
        //si deuxieme cookie
        else {
          //si possibilité de swap
          if (Cookie.distance(this.cookiesCliquees[0], cookie) === 1){
            cookie.selectionnee();
            
            Cookie.swapCookies(this.cookiesCliquees[0], cookie);
            
            cookie.deselectionnee();
            
            this.cookiesCliquees[0].deselectionnee();
            this.cookiesCliquees = [0, 0];

            this.detecterMatch3Colonnes(); //marque les cookies matchés
            this.detecterMatch3Lignes();
            this.removeMatchedCookiesCol();

          }
          // s'il n'y a pas possibilité de swap
          else {
            this.cookiesCliquees[0].deselectionnee();
            cookie.deselectionnee();
            this.cookiesCliquees = [];
          }
    }});
      // drag 
      div.addEventListener("dragstart",
        () => {
          cookie.selectionnee();
          this.cookiesCliquees = [cookie, 0];
        })
      
      // css mods during drag 
      div.addEventListener("dragenter", 
        () => {
          cookie.htmlImage.classList.add("grilleDragOver");
        })
      
      // css mods after drag
      div.addEventListener("dragleave", 
      () => {
        cookie.htmlImage.classList.remove("grilleDragOver");
      })

      // drop
      div.addEventListener("drop", 
        () => {
          
          if (Cookie.distance(this.cookiesCliquees[0], cookie) === 1){
            cookie.selectionnee();
            
            Cookie.swapCookies(this.cookiesCliquees[0], cookie);
            
            cookie.deselectionnee();
            
            this.cookiesCliquees[0].deselectionnee();
            this.cookiesCliquees = [0, 0];
            cookie.htmlImage.classList.remove("grilleDragOver");
            this.detecterMatch3Colonnes(); //marque les cookies matchés
            this.detecterMatch3Lignes();
            this.removeMatchedCookiesCol();

          }
          // s'il n'y a pas possibilité de swap
          else {
            this.cookiesCliquees[0].deselectionnee();
            cookie.deselectionnee();
            this.cookiesCliquees = [];
            cookie.htmlImage.classList.remove("grilleDragOver");
          }
        })
    });
  }


  /**
   * renvoie cookie sur la ligne et colonne en param
   * @param {int} ligne 
   * @param {int} colonne 
   */
  /*getCookieDepuisLC(ligne, colonne) {
    return this.tabCookies[ligne][colonne];
  }*/

  /**
   * return tab de types des cookies en parametre
   */
  static getCookieTypes(cookies){
    let res = [];
    for(let i = 0; i < cookies.length; i++){
      res.push(cookies[i].getType());
    }
    return res;
  }

  updateScore(int){
    let score = document.querySelector("#score");
    score.innerHTML = int;
    if (this.score > 99){
      this.score = 0;
      alert("Bien joué!! Vous avez gagné");
      location.reload();
    }
  }

  /**
   * return tab des indices des cookies matchs
   */
  static duplicates(tab){
    //on ajoute un element au debut à la fin afin de pouvoir faire i-1 et i+1
    tab.push(-1, 7, 7);
    tab.unshift(-1);

    let res = [];
    let i = 1;
    while (i < tab.length){
      if (tab[i] === tab[i-1] && tab[i] === tab[i+1]){
        res.push(i-2, i-1, i); //car on a ajouté un element au debut
        res = res.concat(Grille.match4(i, tab));
        i++;
      }
      i++;
    }
    return res
  }

  /**
   * verifie si il y a possibilité de match avec plus de 3 cookies
   * peut renvoyer plusieurs fois le meme indice donc il faut utiliser
   * que les indices unique
   */
  static match4(i, tab){

    let res = [];
    if (tab[i] === tab[i - 2]){
      res.push(i - 2);
    }
    if (tab[i] === tab[i+2]){
      res.push(i + 1);
    }
    //console.log(res);
    return res;
  }

  /** marque les cookies comme match à partir des indices et tous les cookies*/
  static setMatch(indice, tabCookies){
    for (let i = 0; i < indice.length; i++){
      tabCookies[indice[i]].isMatch();
    }
  }

  /**
   * parcours les lignes de tabCookies pour trouver les matchs
   * return tableau de cookies qui sont matchs
   */
  detecterMatch3Lignes(){
    for (let i = 0; i < 9; i++){
      let cookieTypes = Grille.getCookieTypes(this.tabCookies[i]);
      let duplicates = [];
      duplicates = [... new Set(Grille.duplicates(cookieTypes))]; // ne prendra que les indices unique
      //https://stackoverflow.com/questions/11246758/how-to-get-unique-values-in-an-array
      Grille.setMatch(duplicates, this.tabCookies[i]);
    }
  }

  /**
   * converti tableau de tableaux de lignes en tableau de tableaux de colonnes
   */
  static ligne2Colonne(tabDeTabs){
    let tab2Col = create2DArray(tabDeTabs.length);
    for (let i = 0; i < tabDeTabs.length; i++){
      for (let j = 0; j < tabDeTabs.length; j++){
        tab2Col[j][i] = tabDeTabs[i][j];
      }
    }
    return tab2Col
  }

  /**
   * parcours les colonnes de tabCookies pour trouver les matchs
   * return tableau de cookies qui sont matchs
   */
  detecterMatch3Colonnes(){
    let tab = Grille.ligne2Colonne(this.tabCookies);
    for (let i = 0; i < 9; i++){
      let cookieTypes = Grille.getCookieTypes(tab[i])
      let duplicates = [];
      duplicates = [... new Set(Grille.duplicates(cookieTypes))]; // ne prendra que les indices unique
      Grille.setMatch(duplicates, tab[i]);
    }
  }

  /** trouve les cookies qui font partie d'un match */
  findMatches(){
    this.detecterMatch3Colonnes();
    this.detecterMatch3Lignes();
  }

  /**
   * renvoie un nouveau cookie aleatoire qui est different du type donne en param
   */
  static genNewCookie(cookie){
    let res = cookie.type;
    while (res === cookie.type){
      res = Math.floor((Math.random()*6));
    }
    return new Cookie(res, cookie.ligne, cookie.colonne);
  }

  /**
   * change les cookies match dans un colonne
   */
  noMatchCol(){
    let tab = Grille.ligne2Colonne(this.tabCookies);
    let duplicates = [];
    for (let i = 0; i < 9; i++){
      let cookieTypes = Grille.getCookieTypes(tab[i])
      duplicates = [... new Set(Grille.duplicates(cookieTypes))]; // ne prendra que les indices unique
      for (let j = 1; j < duplicates.length; j=j+2){
        let c1 = tab[i][duplicates[j]];
        Cookie.changeCookie(c1, Grille.genNewCookie(c1));
      }
    }
  }

  /**
   * change les cookies match dans une ligne
   */
  noMatchLignes(){
    let duplicates = [];
    for (let i = 0; i < 9; i++){
      let cookieTypes = Grille.getCookieTypes(this.tabCookies[i]);
      duplicates = [... new Set(Grille.duplicates(cookieTypes))]; // ne prendra que les indices unique
      for (let j = 1; j < duplicates.length; j=j+2){
        let c1 = this.tabCookies[i][duplicates[j]];
        Cookie.changeCookie(c1, Grille.genNewCookie(c1));
      }
    }
  }



  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    this.tabCookies = create2DArray(this.nbLignes);

    for (let i = 0; i < this.nbLignes; i++){
      for (let j = 0; j < this.nbColonnes; j++){
        let type = Math.floor((Math.random()*nbDeCookiesDifferents));
        this.tabCookies[i][j] = new Cookie(type, i, j);
      }
    }
    this.noMatchCol();
    this.noMatchLignes();
    if (this.checkIfMatch() === true){
      console.log(("j'ai du reremplir le tab"));
      return this.remplirTableauDeCookies(nbDeCookiesDifferents);
    }
    /* ^^devrait enlever tous les match
    MAIS
    il peut arriver qu'un cookie generé au hasard pendant noMatchCol produit un match de ligne et vice versa
    il faudra ajouter une methode qui reverifie apres les deux noMatch et recommnence tout s'il y en a un
    cette methode sera pas couteux meme s'il faudra recommencer tout le tableau car ça se produit rarement donc
    elle interviendra presque jamais et quand elle intervient ce sera qu'une repetition
     */
  }

  /**
   * verifie il y a des matchs dans le tab
   */
  checkIfMatch(){
    for (let i = 0; i < 9; i++){
      for (let j = 0; j < 9; j++){
        if (this.tabCookies[i][j].getMatch() === true){
          return true;
        }
      }
    }
    return false;
  }

  removeALLMatches(){
    for (let i = 0; i < 9; i++){
      for (let j = 0; j < 9; j++){
        this.tabCookies[i][j].match = false;
        this.tabCookies[i][j].unhide();
      }
    }
  }

  /**
   * enleve les cookies qui viennent d'êtres matchés par dragndrop ou en selectionnant
   */
  removeMatchedCookiesCol(){
    this.findMatches()
    setTimeout(() => {
        let tab = Grille.ligne2Colonne(this.tabCookies); // convertis à un tab de tab de col
        for (let i = 0; i < tab.length; i++){
          for (let j = 0; j < tab[i].length; j++){ //on itere donc sur chaque element de chaque colonne
            if (tab[i][j].getMatch() === true){ //si le cookie est marqué comme match
              let indexInCol = j;
              this.score ++;
              this.updateScore(this.score);
              while (indexInCol > 0){ // ramene le cookie matché à l'indice 0 soit tout en haut
                let wait;
                wait = Cookie.swapCookies(tab[i][indexInCol], tab[i][indexInCol - 1]);
                //on change aussi les affichages pour garder le cookie à remplacer caché
                tab[i][indexInCol - 1].hide(); //on échange seulement les images donc il faut aussi swap les attributs
                tab[i][indexInCol].unhide();
                indexInCol --;
              }
              let ligne = tab[i][0].ligne;
              let colonne = tab[i][0].colonne;
              let type = Math.floor((Math.random()*6));
              let c2 = new Cookie (type, ligne, colonne);
              tab[i][0].type = type;
              tab[i][0].htmlImage.src = c2.htmlImage.src;
              tab[i][0].unhide();
              tab[i][0].match = false;
            }
          }
        }
        this.removeALLMatches();

      }, 500);
    setTimeout(()=>{
      this.findMatches()
      if (this.checkIfMatch() === true){
        this.removeMatchedCookiesCol();
      }
    }, 1000)

  }
}

