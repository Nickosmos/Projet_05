/**
 * Fichier de gestion de l'affichage dynamique de la page produit
 */

// récupération de l'Id produit
 const ProductId = window.location.search;
 const urlSearchParams = new URLSearchParams(ProductId);
 const id = urlSearchParams.get("id");

// création de la fonction "Article" 
 function Article() {
    fetch(`http://localhost:3000/api/products/${id}`)
    .then(res => res.json())
    .then(product => {console.log(product)

        /**
    // création de la balise <img>
    let productImage = document.createElement("img");
    productImage.src = product.imageUrl;
    productImage.alt = product.altTxt;
    document.getElementsByClassName("item__img").appendChild(productImage);
        */

    // ajout du nom du produit
    let name = document.createTextNode(product.name);
    let hNode = document.getElementById("title");
    hNode.appendChild(name);

    // ajout du prix du produit
    let price = document.createTextNode(product.price);
    let sNode = document.getElementById("price");
    sNode.appendChild(price);

    // ajout de la description du produit
    let description = document.createTextNode(product.description);
    let dNode = document.getElementById("description");
    dNode.appendChild(description);

    // création d'une fonction pour le choix de la couleur
    // voir cours pour récupérer les données d'un "array" et les ajouter dans la fonction
    function Color() {
        for( let colors of product){

            let option = document.createElement("option");
            option.value = product.colors;
            option.textContent = product.colors;
            document.getElementById("colors").appendChild(option);
        }
    }
    Color ();
    })
}
        

Article();