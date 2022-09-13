/**
 * Fichier de gestion de l'affichage dynamique de la page panier
 */

// ++++++++++++++++++ Affichage du panier ++++++++++++++++++

// Création d'une fonction pour récupérer les données du panier stocké dans le LocalStorage
function getCart() {
    let cartProducts = localStorage.getItem("cartProducts");
    if(cartProducts == null) {
        return [];
    }else {
        return JSON.parse(cartProducts);
    }
}
let cart = getCart();

// création d'une fonction pour gérer l'affichage des articles dans le panier
function displayItem(itemId, itemColor, itemImageUrl, itemAltTxt, itemName, itemPrice, itemQuantity) {
    
    // création de la balise article
    let articleLink = document.createElement("a");
    articleLink.className = "cart__item";
    articleLink.setAttribute("data-id",itemId);
    articleLink.setAttribute("data-color", itemColor);
    document.getElementById("cart__items").appendChild(articleLink);
              
    // création de la balise div "image"
    let divImg = document.createElement("div");
    divImg.className = "cart__item__img";
    articleLink.appendChild(divImg);
    //création de la balise img
    let articleImg = document.createElement("img");
    articleImg.src = itemImageUrl;
    articleImg.alt = itemAltTxt;
    divImg.appendChild(articleImg);
    
    // création de la balise div "content"
    let divContent = document.createElement("div");
    divContent.className = "cart__item__content";
    articleLink.appendChild(divContent);
    
    // création de la balise div "description"
    let divDescription = document.createElement("div");
    divDescription.className = "cart__item__content__description";
    divContent.appendChild(divDescription);
    // création de la balise H2
    let articleTitle = document.createElement("h2");
    articleTitle.textContent = itemName;
    divDescription.appendChild(articleTitle);
    // création de la balise p "couleur"
    let articleColor = document.createElement("p");
    articleColor.textContent = itemColor;
    divDescription.appendChild(articleColor);
    // création de la balise p "prix"
    let articlePrice = document.createElement("p");
    articlePrice.textContent = `${itemPrice} €`;
    divDescription.appendChild(articlePrice);
    
    // création de la balise div "settings"
    let divSettings = document.createElement("div");
    divSettings.className = "cart__item__content__settings";
    divContent.appendChild(divSettings);
    
    // création de la balise div "quantity"
    let divQuantity = document.createElement("div");
    divQuantity.className = "cart__item__content__settings__quantity";
    divContent.appendChild(divQuantity);
    // création de la balise p "Qté"
    let articleQuantity = document.createElement("p");
    articleQuantity.textContent = "Qté : ";
    divQuantity.appendChild(articleQuantity);
    // création de la balise input
    let inputQuantity = document.createElement("input");
    inputQuantity.type = "number";
    inputQuantity.className = "itemQuantity";
    inputQuantity.name = "itemQuantity";
    inputQuantity.min = "1";
    inputQuantity.max = "100";
    inputQuantity.value = itemQuantity;
    inputQuantity.addEventListener("change", () => {
        let sameProduct = cart.find(p => (p.id == itemId && p.color == itemColor));
        sameProduct.quantity = parseInt(inputQuantity.value);
        localStorage.setItem("cartProducts", JSON.stringify(cart));
        totalItemsQuantity();
        let cartTotalPrice = document.getElementById('totalPrice');        
        newTotalPrice = cartTotalPrice.textContent - (itemQuantity * itemPrice) + (inputQuantity.value * itemPrice);
        itemQuantity = inputQuantity.value;
        cartTotalPrice.innerHTML = newTotalPrice;
    });
    divQuantity.appendChild(inputQuantity);
    
    // création de la balise div "delete"
    let divDelete = document.createElement("div");
    divDelete.className = "cart__item__content__settings__delete";
    divContent.appendChild(divDelete);
    
    // création de la balise p
    let articleDelete = document.createElement("p");
    articleDelete.className = "deleteItem";
    articleDelete.textContent = "Supprimer";
    articleDelete.addEventListener("click", () => {
        cart = cart.filter(p => (p.id != itemId || p.color != itemColor));
        localStorage.setItem("cartProducts", JSON.stringify(cart));
    refreshcart();
    })
    divDelete.appendChild(articleDelete);
}

// création d'une fonction de calcul de la quantité total d'articles
function totalItemsQuantity () {
    let totalQuantity = 0;
    for(let item of cart) {
        totalQuantity += parseInt(item.quantity);
    }
    document.getElementById("totalQuantity").innerHTML = totalQuantity;
}

// création de la fonction pour réafficher le panier
function refreshcart() {
    let sectionToClear = document.getElementById("cart__items");
    sectionToClear.innerHTML = "";
    displayCart();
}


// création d'une fonction pour gérer la récupération et l'affichage du panier
function displayCart(){
    fetch("http://localhost:3000/api/products")
    .then(res => res.json())
    .then(products => {
        let totalPrice = 0;
        for(let cartItem of cart) {
            for(let product of products){
                if(cartItem.id == product._id) {
                    displayItem(
                        cartItem.id,
                        cartItem.color,
                        product.imageUrl,
                        product.altTxt,
                        product.name,
                        product.price,
                        cartItem.quantity
                        );
                totalPrice += product.price * cartItem.quantity;     
                }

            }
        }
        totalItemsQuantity();
        let cartTotalPrice = document.getElementById('totalPrice');
        cartTotalPrice.innerHTML = totalPrice;
    })
    .catch((error) => { console.log(`erreur: ${error}`)})
}

displayCart();


// ++++++++++++++++++ Gestion de la fiche de renseignement pour la commande ++++++++++++++++++

// Déclaration des différents champs du formulaire
let contact = {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
    };

// Création des expressions régulières
let mailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$');
let letterRegExp = new RegExp("^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$");
let addressRegExp = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+");

// Gestion des conditions avec "regex" pour chaque input du formulaire
// validation "firstName"
let firstName = document.getElementById("firstName");
let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
firstName.addEventListener("input", function (i) {
    validFirstName(i.target.value);
    contact.firstName = i.target.value;
})
  
function validFirstName(firstName) {
    let valid = false;
    let testName = letterRegExp.test(firstName);
    if(testName) {
        firstNameErrorMsg.textContent = "";
        valid = true;
    }else {
        firstNameErrorMsg.textContent = "veuillez entrer 2 lettres minimum sans caractère spéciaux";
        valid = false;
    }
    return valid;
}
  
// Validation "lastName"
let lastName = document.getElementById("lastName");
let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
lastName.addEventListener("input", function (e) {
    validLastName(e.target.value);
    contact.lastName = e.target.value;
})
  
function validLastName(lastName) {
    let valid = false;
    let testLastName = letterRegExp.test(lastName);
    if(testLastName) {
        lastNameErrorMsg.textContent = "";
        valid = true;
    }else {
        lastNameErrorMsg.textContent = "veuillez entrer 2 lettres minimum sans caractère spéciaux";
        valid = false;
    }
    return valid;
}
  
// Validation "adress"
let address = document.getElementById("address");
let addressErrorMsg = document.getElementById("addressErrorMsg");
address.addEventListener("input", function (e) {
    validAddress(e.target.value);
    contact.address = e.target.value;
})
  
function validAddress(address) {
    let valid = false;
    let testAddress = addressRegExp.test(address);
    if(testAddress) {
        addressErrorMsg.textContent = "";
        valid = true;
    }else {
        addressErrorMsg.textContent = "veuillez entrer une adresse valide";
        valid = false;
    }
    return valid;
}
  
// Validation "city"
let city = document.getElementById("city");
let cityErrorMsg = document.getElementById("cityErrorMsg");

city.addEventListener("input", function (e) {
    validCity(e.target.value);
    contact.city = e.target.value;
})
  
function validCity(city) {
    let valid = false;
    let testCity = letterRegExp.test(city);
    if(testCity) {
        cityErrorMsg.textContent = "";
        valid = true;
    }else {
        cityErrorMsg.textContent = "veuillez entrer le nom de votre ville";
        valid = false;
    }
    return valid;
}
  
// Validation "email"
let email = document.getElementById("email");
let emailErrorMsg = document.getElementById("emailErrorMsg");
email.addEventListener("input", function (e) {
    validEmail(e.target.value);
    contact.email = e.target.value;
})
  
function validEmail(email) {
    let valid = false;
    let testEmail = mailRegExp.test(email);
    if(testEmail) {
        emailErrorMsg.textContent = "";
        valid = true;
    }else {
        emailErrorMsg.textContent = "veuillez entrer une adresse valide, exemple toto@monmail.fr";
        valid = false;
    }
    return valid;
}


// Création d'une fonction pour commander les articles du panier
function order() {
    let products = [];
    orderButton = document.getElementById("order").addEventListener("click", () => {
        if(letterRegExp.test(firstName.value) == false || letterRegExp.test(lastName.value) == false || addressRegExp.test(address.value) == false || letterRegExp.test(city.value) == false || mailRegExp.test(email.value) == false) {
                window.alert("certains champs du formulaire ne sont pas valide");
        }else if (firstName.value == "" || lastName.value == "" || address.value == "" || city.value == "" || email.value == "") {
                window.alert("veuillez renseigner tout les champs du formulaire");
        }else {
        localStorage.setItem("contact", JSON.stringify(contact));
    
        // Vérification que le panier n'est pas vide
        if(cart && cart.length) {
            for (let cartItems of cart) {
            products.push(cartItems.id)
            }
    
            let order = {
            contact: contact,
            products: products,
            }
    
            //fetch méthode Post pour envoyer les informations du formulaire
            fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((data) => {
                let orderId = data.orderId;
                window.location.assign("confirmation.html?id=" + orderId)
            })
   
            }else {
            alert("Le panier est vide");
            }
        }
    })
}
order();