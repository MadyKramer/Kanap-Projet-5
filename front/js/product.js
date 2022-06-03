const id = window.location.search.split("?")[1];
/**
 * Récupère le panier du localStorage
 * @returns array
 */
const getCart = () => {
  let cart = localStorage.getItem("cart");
  //Si il n'y a rien dans le panier, on retourne un tableau vide
  if (cart == null) {
    return [];
    //Sinon on récupère en JS
  } else {
    return JSON.parse(cart);
  }
};
/**
 * Récupération du produit grâce à l'ID correspondant
 * @returns {promise}
 */
const getProduct = async () => {
  const request = await fetch("http://localhost:3000/api/products/" + id);
  if (request.ok) {
    const response = await request.json();
    console.log(response);
    return response;
  }
};

getProduct().then((product) => {
  // description
  document.getElementById("description").textContent = product.description;

  // img
  const productImg = document.createElement("img");
  productImg.setAttribute("src", product.imageUrl);
  productImg.setAttribute("alt", product.altTxt);
  document.querySelector(".item__img").appendChild(productImg);

  //prix
  document.getElementById("price").textContent = product.price;

  // couleurs
  for (let color of product.colors) {
    const option = document.createElement("option");
    option.setAttribute("value", color);
    option.textContent = color;
    document.getElementById("colors").appendChild(option);
  }
});

//Ajouter un produit au panier
const addCart = () => {
  const cart = getCart();
  let quantity = document.getElementById("quantity").value;
  let color = document.getElementById("colors").value;
  const article = {
    id: id,
    color: color,
    quantity: quantity,
  };
  
  const foundProduct = cart.find((p) => p.id == id && p.color == color);
  if (foundProduct == undefined) {
    cart.push(article);
  } else {
    foundProduct.quantity = Number(foundProduct.quantity) + Number(quantity);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
};

let btn = document.getElementById("addToCart");
btn.addEventListener("click", addCart);
