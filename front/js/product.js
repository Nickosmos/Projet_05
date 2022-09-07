/**
 * Fichier de gestion de l'affichage dynamique de la page produit
 */

// récupération de l'Id produit
const ProductId = window.location.search;
const urlSearchParams = new URLSearchParams(ProductId);
const id = urlSearchParams.get("id");

// création de la fonction "Article" 
function getArticle() {
    if(id){
    fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.json())
    .then(product => {


    //création de la fiche info produit
          
    // création de la balise <img>
    let imageProduct = document.createElement("img");
    imageProduct.src = product.imageUrl;
    imageProduct.alt = product.altTxt;
    let classImg = document.getElementsByClassName("item__img");
    classImg[0].appendChild(imageProduct);
    
    // ajout du nom du produit
    document.getElementById("title").innerHTML = product.name;

    // ajout du prix du produit
    document.getElementById("price").innerHTML = product.price;
    
    // ajout de la description du produit
    document.getElementById("description").innerHTML = product.description;

    // appel de la fonction "couleur"
    setColor(product.colors);
    })
    .catch((error) => { console.log(`erreur: ${error}`)})

    } else { 
        console.log("ID Introuvable");
    }
}
   
// création d'une fonction pour le choix de la couleur
function setColor(colors) {
    for( let color of colors){

        // ajout des options de couleurs
        let option = document.createElement("option");
        option.value = color;
        option.textContent = color;
        document.getElementById("colors").appendChild(option);
    }
}

// appel de la fonction "Article"
getArticle();



function saveCart(cart) {
    localStorage.setItem("cartProducts", JSON.stringify(cart));
}

function getCart() {
    let cart = localStorage.getItem("cartProducts");
    if(cart == null) {
        return [];
    }else {
        return JSON.parse(cart);
    }
}

function addToCart() {
    const selectedColor = document.getElementById("colors").value;
    const selectedQuantity = document.getElementById("quantity").value;
    let cart = getCart();
    let sameProduct = cart.find(p => (p.id == id && p.color == selectedColor));
    if(sameProduct != undefined) {
        sameProduct.quantity = parseInt(sameProduct.quantity) + parseInt(selectedQuantity);
    }else {
        let product = {
            id: id,
            color: selectedColor,
            quantity: selectedQuantity
        }
        cart.push(product);
    }
    saveCart(cart);
}

const buttonAddToCart = document.getElementById("addToCart");
buttonAddToCart.addEventListener("click", () => {
    addToCart();
})