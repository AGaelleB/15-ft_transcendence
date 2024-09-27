// frontend/srcs/js/PongGame/power-ups.js

/* 
    idees de power-ups :

    le power up sera a activer ou desactiver dans les parametres en debut de jeu

    Durée des effets : les powers ups vont durer entre 5 à 10 secondes
    Apparition aléatoire : Les power-ups peuvent apparaître aléatoirement sur le terrain à intervalles réguliers
    Indicateur visuel : Ajoute un indicateur visuel lorsque les power-ups sont actifs (couleur, taille, effet lumineux, etc.
    
    Idees de power-ups : 

    Bonus :
        - va augmenter temporairement la taille de notre paddle (champi)
        - va augmenter temporairement la vitessse de notre paddle (eclair)

    Malus : 
        - va reduire temporairement la taille de notre paddle (chanpi dead)
        - va reduire temporairement la vitessse de notre paddle (tortue)

    Autre si on a envie:
        - ajoute une novuelle balle dans le jeu
*/


// Chemin vers les images
const powerUpsImages = [
    'srcs/images/power-ups/sizeUpPaddle.png',
    'srcs/images/power-ups/sizeDownPaddle.png',
    'srcs/images/power-ups/speedPaddle.png',
    'srcs/images/power-ups/slowPaddle.png'
];

// Création d'un élément image pour afficher le power-up
const powerUpImageElement = document.createElement('img');
document.body.appendChild(powerUpImageElement); // Ajoutez l'élément à votre canvas ou à un conteneur approprié
powerUpImageElement.style.position = 'absolute'; // Positionnez-le en absolu pour le placer où vous voulez
powerUpImageElement.style.display = 'none'; // Cachez-le par défaut

function showRandomPowerUp() {
    // Choisissez une image aléatoire
    const randomIndex = Math.floor(Math.random() * powerUpsImages.length);
    const selectedImage = powerUpsImages[randomIndex];

    // Définissez la source de l'image
    powerUpImageElement.src = selectedImage;

    // Positionnez l'image aléatoirement sur le canvas
    powerUpImageElement.style.left = Math.random() * (window.innerWidth - 50) + 'px'; // Ajustez -50 pour la largeur de l'image
    powerUpImageElement.style.top = Math.random() * (window.innerHeight - 50) + 'px'; // Ajustez -50 pour la hauteur de l'image

    // Affichez l'image
    powerUpImageElement.style.display = 'block';

    // Cachez l'image après 2 secondes (vous pouvez ajuster cela si nécessaire)
    setTimeout(() => {
        powerUpImageElement.style.display = 'none';
    }, 5000); // Masquez l'image après 2 secondes
}

// Exécutez la fonction toutes les 5 secondes
setInterval(showRandomPowerUp, 1000);