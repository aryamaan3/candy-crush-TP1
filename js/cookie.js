class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  htmlImage;
  type;
  colonne;
  ligne;
  match;

  constructor(type, ligne, colonne) {
    // A FAIRE
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.htmlImage = document.createElement('img');
    this.htmlImage.src = Cookie.urlsImagesNormales[type];
    this.htmlImage.width = 80;
    this.htmlImage.height = 80;
    this.htmlImage.dataset.ligne =ligne;
    this.htmlImage.dataset.colonne =colonne;
    this.htmlImage.classList.add("cookies");
    this.match = false;
  }

  selectionnee() {
    // on change l'image et la classe CSS
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
    this.htmlImage.classList.add("cookies-selected");
  }

  deselectionnee() {
    // on change l'image et la classe CSS
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    this.htmlImage.classList.remove("cookies-selected");
  }

  static swapCookies(c1, c2) {
    // On échange leurs images et types
    let swap1 = [c1.type, c1.htmlImage.src];
    let swap2 = [c2.type, c2.htmlImage.src];

    c1.type = swap2[0];
    c1.htmlImage.src = swap2[1];
    
    c2.type = swap1[0];
    c2.htmlImage.src = swap2[1];

  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    return distance;
  }

  /**renvoie le type */
  getType(){
    return this.type;
  }

  /** renvoie true si cookie fait partie des match*/
  getMatch(){
    return this.match;
  }

  /**permet de marque un cookie comme match*/
  isMatch(){
      this.match = true;
      this.htmlImage.classList.add("cookieMatch");
      // permet de voir les matchs qui ont été detectés
      setTimeout(() => {
        this.htmlImage.classList.remove("cookieMatch");
      }, 500);
  }

  /** cache le cookie à partir du css */
  hide(){
    this.htmlImage.classList.add("cookie-hide");
  }

  unhide(){
    this.htmlImage.classList.remove("cookie-hide");
    this.htmlImage.classList.remove("cookieMatch");
  }

  /**
   * remplace un cookie par l'autre
   * @param c1 cookie à changer
   * @param c2 avec quoi changer
   */
  static changeCookie(c1, c2){
    let swap = c2.htmlImage.src;
    c1.type = c2.type;
    c1.htmlImage.src = swap;
  }
}
