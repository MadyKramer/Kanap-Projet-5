/**
 * Création des éléments DOM
 * @param {array} product
 */

const createDomProduct = (product) => {
  //lien
  const newElementLink = document.createElement("a");
  let elementLink = document.getElementById("items");
  elementLink.appendChild(newElementLink);
  newElementLink.setAttribute("href", "./product.html?" + product._id);

  //article

  const newElementArticle = document.createElement("article");
  newElementLink.appendChild(newElementArticle);

  //image

  const newElementImg = document.createElement("img");
  newElementArticle.appendChild(newElementImg);
  newElementImg.setAttribute("src", product.imageUrl);
  newElementImg.setAttribute("alt", product.altTxt);

  //titres produits

  const newTitleProduct = document.createElement("h3");
  newTitleProduct.classList.add("productName");
  newTitleProduct.textContent = product.name;
  newElementArticle.appendChild(newTitleProduct);

  //descr produit

  const newDescriptionProduct = document.createElement("p");
  newDescriptionProduct.classList.add("productDescription");
  newDescriptionProduct.textContent = product.description;
  newElementArticle.appendChild(newDescriptionProduct);
};

/**
 * Récupértion des produits dans l'API
 * @returns {promise}
 */
const getProducts = async () => {
  const request = await fetch("http://localhost:3000/api/products");
  if (request.ok){
    const response = await request.json();
    return response;
  }
};

//Affichage du contenu sur la page d'accueil 
const products = getProducts()
  .then((res) => {
    for (let product of res){
        createDomProduct(product);
    }
  })
  .catch(() => {
    console.log("Requête échouée");
  });
