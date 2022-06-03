//Recupération du numéro de commande
let url = new URL(window.location.href)
const orderNumber = url.searchParams.get("orderId")
console.log(orderNumber)

//Affichage dans le DOM
const orderId = document.getElementById("orderId")
orderId.innerText = orderNumber;