/**
 * Fichier de gestion de l'affichage dynamique de la page d'acceuil
 */

// création de la fonction "produit"
function products () {
    fetch("http://localhost:3000/api/products")
    .then(data => data.json())
    .then(jsonListProducts => {
        for(let product of jsonListProducts){

        //création de la fiche produit
        // création de la balise <a>
        let productLink = document.createElement("a");
        productLink.href =`./product.html?id=${product._id}`;
        document.getElementById("items").appendChild(productLink);

        // création de la balise <article>
        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        // création de la balise <image>
        let productImage = document.createElement("img");
        productImage.src = product.imageUrl;
        productImage.alt = product.altTxt;
        productArticle.appendChild(productImage);

        // création de la balise <h3>
        let productTitle = document.createElement("h3");
        productTitle.className = "productName";
        productTitle.textContent = product.name;
        productArticle.appendChild(productTitle);

        // création de la balise <p>
        let productDescription = document.createElement("p");
        productDescription.className = "productDescription";
        productDescription.textContent = product.description;
        productArticle.appendChild(productDescription);
        }
    })
    .catch((error) => { console.log(`erreur: ${error}`)})
}

// appel de la fonction "produit"
products();
