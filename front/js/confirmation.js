/**
 * Fichier de gestion de la confirmation de commande
 */


// récupération id
const order = window.location.search;
const urlSearchParams = new URLSearchParams(order);
const id = urlSearchParams.get("id");

// récupération numéro de commande
let orderId = document.getElementById("orderId");
orderId.textContent = id;

// nettoyage du localStorage pour ne pas garder de données
localStorage.clear(); 