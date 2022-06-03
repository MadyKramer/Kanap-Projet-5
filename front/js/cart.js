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

const section = document.getElementById("cart__items");
const price = document.getElementById("totalPrice");
const quantity = document.getElementById("totalQuantity");

//Afficher chaque article du panier dans le DOM

const createArticle = () => {
  console.log(section.children);
  let sumPrices = 0;
  let sumQuantity = 0;
  //Eviter les doublons
  while (section.children.length > 0) {
    section.removeChild(section.childNodes[0]);
  }
  const localStorageProduct = getCart();
  console.log(localStorageProduct);
  if (localStorageProduct.length == 0) {
    section.innerText = "Votre panier est vide";
  } else {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((res) => {
        for (let product of res) {
          for (let article of localStorageProduct) {
            if (product._id == article.id) {
              sumPrices += article.quantity * product.price;
              sumQuantity += article.quantity;
              let productArticle = document.createElement("article");

              productArticle.classList.add("cart__item");
              productArticle.setAttribute("data-id", article.id);
              productArticle.setAttribute("data-color", article.color);
              section.appendChild(productArticle);

              let productDivImg = document.createElement("div");
              productDivImg.classList.add("cart__item__img");
              productArticle.appendChild(productDivImg);

              let productImg = document.createElement("img");
              productDivImg.appendChild(productImg);
              productImg.setAttribute("src", product.imageUrl);
              productImg.setAttribute("alt", product.altTxt);

              let cartItemContent = document.createElement("div");
              cartItemContent.classList.add("cart__item__content");
              productArticle.appendChild(cartItemContent);

              let cartItemContentDescription = document.createElement("div");
              cartItemContent.appendChild(cartItemContentDescription);
              cartItemContentDescription.classList.add(
                "cart__item__content__description"
              );

              let productName = document.createElement("h2");
              cartItemContentDescription.appendChild(productName);
              productName.innerText = product.name;

              let productColor = document.createElement("p");
              cartItemContentDescription.appendChild(productColor);
              productColor.innerText = article.color;

              let productPrice = document.createElement("p");
              cartItemContentDescription.appendChild(productPrice);
              productPrice.innerText = `${product.price} €`;

              let cartItemContentSettings = document.createElement("div");
              cartItemContent.appendChild(cartItemContentSettings);
              cartItemContentSettings.classList.add(
                "cart__item__content__settings"
              );

              let cartItemContentSettingsQuantity =
                document.createElement("div");
              cartItemContentSettings.appendChild(
                cartItemContentSettingsQuantity
              );
              cartItemContentSettingsQuantity.classList.add(
                "cart__item__content__settings__quantity"
              );

              let itemQuantity = document.createElement("p");
              itemQuantity.innerText = "Qté :";
              cartItemContentSettingsQuantity.appendChild(itemQuantity);

              let quantityInput = document.createElement("input");
              cartItemContentSettingsQuantity.appendChild(quantityInput);
              quantityInput.classList.add("itemQuantity");
              quantityInput.value = article.quantity;
              quantityInput.setAttribute("type", "number");
              quantityInput.setAttribute("min", "1");
              quantityInput.setAttribute("max", "100");
              quantityInput.setAttribute("name", "itemQuantity");

              quantityInput.addEventListener("change", (e) =>
                changeQuantity(e, quantityInput)
              );

              let cartItemContentSettingsDelete = document.createElement("div");
              cartItemContentSettings.appendChild(
                cartItemContentSettingsDelete
              );
              cartItemContentSettingsDelete.classList.add(
                "cart__item__content__settings__delete"
              );

              //Bouton "supprimer"
              let deleteBtn = document.createElement("p");
              cartItemContentSettingsDelete.appendChild(deleteBtn);
              deleteBtn.innerText = "Supprimer";
              deleteBtn.addEventListener("click", () => deleteItem(deleteBtn));

              price.innerText = sumPrices;
              quantity.innerText = sumQuantity;
            }
          }
        }
      });
  }
};

createArticle();

/**
 * Supprimer un article
 * @param {*HTMLElement} elt
 * @param {*array} array
 */
const deleteItem = (elt) => {
  const array = getCart();
  const article = elt.closest("article");
  const color = article.getAttribute("data-color");
  const id = article.getAttribute("data-id");
  const keepElt = array.filter((p) => p.id != id || p.color != color);
  localStorage.setItem("cart", JSON.stringify(keepElt));
  createArticle(); //Delete le DOM dans la liste des pdts
};

/**
 * Changer la quantité
 * @param {object} e
 * @param {HTMLElement} elt
 * @param {array} array
 */
const changeQuantity = (e, elt) => {
  const array = getCart();
  const article = elt.closest("article");
  const color = article.getAttribute("data-color");
  const id = article.getAttribute("data-id");
  const findProducts = array.map((p) => {
    if (p.id === id && p.color === color) {
      p.quantity = Number(e.target.value);
      if (e.target.value > 1  && e.target.value < 99) {
        return p
      }else{
        alert('Veuillez saisir un nombre entre 1 et 100')
      }
    } else {
      return p;
    }
  });
  localStorage.setItem("cart", JSON.stringify(findProducts));
  createArticle();
};

const form = document.querySelector(".cart__order__form");
const inputs = document.querySelectorAll(".cart__order__form__question input"); //Nodelist
const errorMessages = document.querySelectorAll(
  ".cart__order__form__question p"
);

//Regex

const regexQuantityInput = new RegExp(/^[1-9][0-9]?$|^100$/i);
const regexEmail = new RegExp(/[\w\-_.]+@[a-z]+[.][a-z]+/i); //.-_ autorisés, doit contenir un @ et un point.
const regexName = new RegExp(/^[a-z]+[éàèê\-\ a-z]+[éàèêa-z]+$/i); //Peut contenir accents, peut contenir espaces et tirets, doit contenir au moins 3 caractères
const regexAddress = new RegExp(/^[0-9]{1,4}\ [a-z\ éôàêèï]+/i); //Doit commencer par un nombre (max4) puis un espace puis une chaine de caractères

//Evt change à chaque input
inputs.forEach((input) =>
  input.addEventListener("change", (e) => inputChange(e, input))
);

/**
 * Ajoute la valeur saisie par l'utilisateur dans l'input
 * @param {object} e
 * @param {HTMLElement} elt
 */
const inputChange = (event, elt) => {
  elt.value = event.target.value;
};

form.addEventListener("submit", (e) => sendData(e));
/**
 * Envoyer données au serveur
 * @param {*object} contact
 * @param {*array} products
 */
const sendOrder = async (contact, products) => {
  try {
    const request = await fetch("http://localhost:3000/api/products/order", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ contact, products }),
    });
    const response = await request.json();
    window.location.href = "confirmation.html?orderId=" + response.orderId;
  } catch {
    console.log("erreur");
  }
};

/**
 * validation formulaire
 * @param {*object} e
 */
const sendData = (e) => {
  e.preventDefault();
  inputs.forEach((input, index) => {
    if (input.value == "") {
      errorMessages[index].innerText = "Veuillez remplir ce champ";
    } else {
      errorMessages[index].innerText = "";
    }
  });
  //Si l'index 0 ne match pas avec notre regex
  if (inputs[0].value && !inputs[0].value.match(regexName)) {
    //On renvoie
    errorMessages[0].textContent =
      "Ce champ accepte uniquement des lettres, espaces et -";
  }
  if (inputs[1].value && !inputs[1].value.match(regexName)) {
    errorMessages[1].textContent =
      "Ce champ accepte uniquement des lettres, espaces et -";
  }
  if (inputs[2].value && !inputs[2].value.match(regexAddress)) {
    errorMessages[2].textContent = "Veuillez saisir une addresse valide";
  }
  if (inputs[3].value && !inputs[3].value.match(regexName)) {
    errorMessages[3].textContent =
      "Ce champ accepte uniquement des lettres, espaces et -";
  }
  if (inputs[4].value && !inputs[4].value.match(regexEmail)) {
    errorMessages[4].textContent = "Veuillez saisir une adresse e-mail valide";
  }
  const contact = {
    firstName: inputs[0].value,
    lastName: inputs[1].value,
    address: inputs[2].value,
    city: inputs[3].value,
    email: inputs[4].value,
  };
  const products = getCart().map((product) => product.id);
  let validateInput = 0;
  inputs.forEach((input) => {
    if (
      (input.value && input.value.match(regexAddress)) ||
      input.value.match(regexEmail) ||
      input.value.match(regexName)
    ) {
      validateInput++;
    }
  });
  if (inputs.length == validateInput) {
    sendOrder(contact, products);
  }
};
