/* ==========================================
   Pure & Natural Oils
   app.js - Part 1
   ========================================== */

// -----------------------------
// Global Variables
// -----------------------------

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// -----------------------------
// Save Cart
// -----------------------------

function saveCart() {

    localStorage.setItem("cart", JSON.stringify(cart));

}


// -----------------------------
// Update Cart Badge
// -----------------------------

function updateCartCount() {

    const badge = document.getElementById("cart-count");

    if (!badge) return;

    let totalItems = 0;

    cart.forEach(item => {

        totalItems += item.qty || 1;

    });

    badge.innerText = totalItems;

}


// -----------------------------
// Toast Notification
// -----------------------------

function showNotification(message) {

    let toast = document.getElementById("toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.id = "toast";

        document.body.appendChild(toast);

    }

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


// -----------------------------
// Add Product
// -----------------------------

function addToCart(product) {

    const existing = cart.find(item =>
        item.name === product.name &&
        item.size === product.size
    );

    if (existing) {

        existing.qty += 1;

    } else {

        product.qty = 1;

        cart.push(product);

    }

    saveCart();

    updateCartCount();

    showNotification(product.name + " added to cart.");

}


// -----------------------------
// Read Product Card
// -----------------------------

function readProduct(card) {

    const product = {

        name: card.querySelector("h3").innerText,

        price: card.querySelector("h4").innerText,

        size: card.querySelector("select").value,

        image: card.querySelector("img").getAttribute("src")

    };

    return product;

}


// -----------------------------
// Register Buttons
// -----------------------------

function registerAddButtons() {

    const buttons = document.querySelectorAll(".product-card button");

    buttons.forEach(button => {

        button.addEventListener("click", function (event) {

            event.preventDefault();

            const card = this.closest(".product-card");

            const product = readProduct(card);

            addToCart(product);

        });

    });

}


// -----------------------------
// Smooth Scroll
// -----------------------------

function enableSmoothScroll() {

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function (e) {

            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                target.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });

}


// -----------------------------
// Initialize
// -----------------------------

document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

    registerAddButtons();

    enableSmoothScroll();

});
/* ==========================================
   CART FUNCTIONS
   Part 2
========================================== */

// -----------------------------
// Display Cart
// -----------------------------

function displayCart() {

    const container = document.getElementById("cart-container");

    const totalElement = document.getElementById("cart-total");

    if (!container) return;

    container.innerHTML = "";

    if (cart.length === 0) {

        container.innerHTML = `
            <div style="text-align:center;padding:60px;">
                <h2>Your cart is empty</h2>
                <p>Add products from the Home page.</p>
            </div>
        `;

        if(totalElement)
            totalElement.innerText = "0";

        return;

    }

    let total = 0;

    cart.forEach((item,index)=>{

        const price = Number(item.price.replace(/[^\d]/g,""));

        const qty = item.qty || 1;

        total += price * qty;

        const card = document.createElement("div");

        card.className = "cart-card";

        card.innerHTML = `

        <img src="${item.image}" alt="${item.name}">

        <div class="cart-details">

            <h2>${item.name}</h2>

            <p><strong>Price:</strong> ${item.price}</p>

            <p><strong>Pack:</strong> ${item.size}</p>

            <div class="qty-container">

                <button class="qty-btn"
                onclick="decreaseQty(${index})">-</button>

                <span>${qty}</span>

                <button class="qty-btn"
                onclick="increaseQty(${index})">+</button>

            </div>

            <button class="remove-btn"
            onclick="removeItem(${index})">

            Remove

            </button>

        </div>

        `;

        container.appendChild(card);

    });

    if(totalElement){

        totalElement.innerText = total.toLocaleString();

    }

}

// -----------------------------
// Increase Quantity
// -----------------------------

function increaseQty(index){

    cart[index].qty = (cart[index].qty || 1) + 1;

    saveCart();

    updateCartCount();

    displayCart();

}

// -----------------------------
// Decrease Quantity
// -----------------------------

function decreaseQty(index){

    if((cart[index].qty || 1) > 1){

        cart[index].qty--;

    }

    saveCart();

    updateCartCount();

    displayCart();

}

// -----------------------------
// Remove Item
// -----------------------------

function removeItem(index){

    if(confirm("Remove this product from cart?")){

        cart.splice(index,1);

        saveCart();

        updateCartCount();

        displayCart();

        showNotification("Product removed.");

    }

}

// -----------------------------
// Clear Cart
// -----------------------------

function clearCart(){

    if(confirm("Clear entire cart?")){

        cart=[];

        saveCart();

        updateCartCount();

        displayCart();

    }

}

// -----------------------------
// Initialize Cart Page
// -----------------------------

document.addEventListener("DOMContentLoaded",()=>{

    displayCart();

});
/* ==========================================
CHECKOUT MODULE
========================================== */

function loadCheckout(){

    const list=document.getElementById("checkout-items");

    const total=document.getElementById("checkout-total");

    if(!list) return;

    list.innerHTML="";

    let grandTotal=0;

    cart.forEach(item=>{

        let price=Number(item.price.replace(/[^\d]/g,""));

        let qty=item.qty || 1;

        grandTotal+=price*qty;

        list.innerHTML+=`

        <div class="checkout-item">

            <span>

            ${item.name}

            (${qty})

            </span>

            <span>

            ₹${price*qty}

            </span>

        </div>

        `;

    });

    total.innerText=grandTotal.toLocaleString();

}

document.addEventListener("DOMContentLoaded",()=>{

loadCheckout();

});

const checkoutForm=document.getElementById("checkout-form");

if(checkoutForm){

checkoutForm.addEventListener("submit",(e)=>{

e.preventDefault();

const customer={

name:document.getElementById("customerName").value,

mobile:document.getElementById("customerMobile").value,

email:document.getElementById("customerEmail").value,

address:document.getElementById("customerAddress").value,

city:document.getElementById("customerCity").value,

state:document.getElementById("customerState").value,

pincode:document.getElementById("customerPincode").value

};

localStorage.setItem(

"customer",

JSON.stringify(customer)

);

alert("Customer details saved successfully.");

window.location.href="payment.html";

});

}
/* ==========================================
   PAYMENT MODULE
========================================== */

function loadPaymentSummary() {

    const container = document.getElementById("payment-items");
    const totalElement = document.getElementById("payment-total");

    if (!container || !totalElement) return;

    container.innerHTML = "";

    let total = 0;

    cart.forEach(item => {

        const price = Number(item.price.replace(/[^\d]/g, ""));
        const qty = item.qty || 1;
        const subtotal = price * qty;

        total += subtotal;

        container.innerHTML += `
            <div class="payment-item">
                <span>${item.name} × ${qty}</span>
                <span>₹${subtotal}</span>
            </div>
        `;
    });

    totalElement.innerText = total.toLocaleString();

}


// ---------------------------
// Payment Method
// ---------------------------

document.addEventListener("DOMContentLoaded", function () {

    loadPaymentSummary();

    const radios = document.querySelectorAll("input[name='payment']");
    const upiBox = document.getElementById("upi-box");

    radios.forEach(radio => {

        radio.addEventListener("change", function () {

            if (this.value === "UPI") {

                upiBox.classList.remove("hidden");

            } else {

                upiBox.classList.add("hidden");

            }

        });

    });

});


// ---------------------------
// Proceed Button
// ---------------------------

const payButton = document.getElementById("pay-now-btn");

if (payButton) {

    payButton.addEventListener("click", function () {

        const paymentMethod =
            document.querySelector("input[name='payment']:checked").value;

        if (paymentMethod === "COD") {

            alert(
                "Order placed successfully.\nPayment Mode : Cash On Delivery"
            );

        

            window.location.href = "order-confirmation.html";

        }

        else if (paymentMethod === "UPI") {

            alert(
                "Please complete the payment using the displayed UPI ID."
            );

            window.location.href = "order-confirmation.html";

        }

        else if (paymentMethod === "RAZORPAY") {

            alert(
                "Razorpay integration will be connected after adding your API Keys and backend."
            );

        }

    });

}
/* ==========================================
ORDER CONFIRMATION
========================================== */

function loadOrderConfirmation(){

const orderItems=document.getElementById("order-items");

if(!orderItems) return;

const customer=JSON.parse(localStorage.getItem("customer")) || {};

const payment=localStorage.getItem("paymentMethod") || "Cash On Delivery";

const cartData=JSON.parse(localStorage.getItem("cart")) || [];

const customerDiv=document.getElementById("customer-details");

customerDiv.innerHTML=`

<p><strong>Name:</strong> ${customer.name || "-"}</p>

<p><strong>Mobile:</strong> ${customer.mobile || "-"}</p>

<p><strong>Email:</strong> ${customer.email || "-"}</p>

<p><strong>Address:</strong>

${customer.address || "-"},

${customer.city || ""},

${customer.state || ""}

${customer.pincode || ""}

</p>

`;

document.getElementById("payment-method").innerText=payment;

const orderId="NV"+Date.now();

document.getElementById("order-id").innerText=orderId;

document.getElementById("order-date").innerText=

new Date().toLocaleString();

let total=0;

orderItems.innerHTML="";

cartData.forEach(item=>{

const price=parseInt(item.price.replace(/[^\d]/g,""));

const qty=item.qty || 1;

const subtotal=price*qty;

total+=subtotal;

orderItems.innerHTML+=`

<div class="order-item">

<span>

${item.name}

(${qty})

</span>

<span>

₹${subtotal}

</span>

</div>

`;

});

document.getElementById("order-total").innerText=

total.toLocaleString();

updateCartCount();

}

document.addEventListener("DOMContentLoaded",()=>{

loadOrderConfirmation();

});
/* ==========================================
WHATSAPP ORDER
========================================== */

function sendWhatsAppOrder(){

    const customer = JSON.parse(localStorage.getItem("customer")) || {};

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];

    const payment =
        localStorage.getItem("paymentMethod") || "Cash On Delivery";

    let total = 0;

    let message =
`🛒 *NEW ORDER - NAEVA COLD PRESSED OILS*

--------------------------------

👤 Customer Details

Name : ${customer.name || ""}

Mobile : ${customer.mobile || ""}

Email : ${customer.email || ""}

Address :
${customer.address || ""}
${customer.city || ""}
${customer.state || ""}
${customer.pincode || ""}

--------------------------------

📦 Ordered Products

`;

    cartData.forEach(item=>{

        const price = parseInt(item.price.replace(/[^\d]/g,""));

        const qty = item.qty || 1;

        const subtotal = price * qty;

        total += subtotal;

        message +=

`${item.name}

Pack : ${item.size}

Quantity : ${qty}

Subtotal : ₹${subtotal}

------------------------

`;

    });

    message +=

`💰 Grand Total : ₹${total}

Payment : ${payment}

🚚 Transportation Charges : Extra

Thank you for ordering from

*NAEVA Cold Pressed Oils*`;

    const phone = "917411246154";

    const url =

"https://wa.me/" +

phone +

"?text=" +

encodeURIComponent(message);

    window.open(url,"_blank");

}