# candy-crush-TP1

**ne se lance pas sur safari** 

[demo](https://aryamaan3.github.io/candy-crush-TP1/)

## Stratégie
Tout d'abord on a ajouté au cookies la propriété match qui est boolean, initialisé à faux.
Ensuite dès qu'on drop ou on selectionne deux cookie [l'algorithme](#implementation-de-lalgorithme) est lancé. Cette algorithme appel une fonction qui parcours le tableau et marque en mettant match = true les cookies qui font partie d'un match.

### Idee
On parcours un par un les cookies de chaque colonne donc de facon vertical. 
Quand on detecte un cookie qui est marqué comme match, on commence à swap avec le cookie au dessus jusqu'à ce que le cookie marqué arrive à la premeire ligne
(indice 0). une fois que le cookie est ramené en haut on génére un nouveau cookie.

### Implementation de l'Algorithme 
On parcours les cookies par colonne, si un cookie est marqué comme match il rentre dans la _condition_.
Dans la _condition_, si l'indice est **superieur à 0**, il n'est pas à la premiere ligne, 
il va falloir le ramener en haut. Pour cela on fait un _while_ indice > 0, dans cette boucle on swap avec le cookie au dessus.
si l'indice est **égale à 0**, on genere un nouveau cookie. Cette algorithme tourne en boucle tant qu'il y a plus de matchs, ce qui fait que s'il y a des nouveau matchs avec les cookies générés, ils sont pris en compte.
