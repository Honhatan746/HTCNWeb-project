console.log(JSON.parse(localStorage.getItem("cart")));
let currentBuyNow = JSON.parse(localStorage.getItem("buyProduct"));
if (currentBuyNow) {
    localStorage.removeItem("buyProduct");
}
console.log(currentBuyNow);
function renderCart() {
    let currentuser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentuser) return;
    let userKey = currentuser.email;

    let allCarts = JSON.parse(localStorage.getItem("cart")) || {};
    let cart = allCarts[userKey] || [];
    const cartContainer = document.getElementById("cart-List");
    const countEl = document.getElementById("cart-count");
    const totalEl = document.getElementById("total-price");
    const finalEl = document.getElementById("final-price");
    console.log(cart);
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Cart is empty</p>";
        countEl.innerText = "0 Product";
        totalEl.innerText = "0đ";
        finalEl.innerText = "0đ";
        return;
    }
    let html = "";
    let total = 0;
    let totalQuantity = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        totalQuantity += item.quantity;

        html += `
        <div class="cart-item di-flex bo-bot">
            <i class="ti-close absolute font-w-700 font-title" onclick="removeItem(${index})"></i>

            <div class="frame_img">
                <img class="img-cls" src="${item.image}" alt="">
            </div>

            <div class="di-flex flex-colum font-text cart-detail">
                <p class="font-w-700 font-price">${item.name}</p>
                ${item.size ? `<p>Size: ${item.size}</p>` : ""}
                <p>Color: ${item.color}</p>

                <div class="product-dt-quantity">
                    <p class="font-title mar-t-b">Số lượng:</p>

                    <div class="btnSoLuong">
                        <button class="btncss no-bor font-w-700" onclick="decrease(${index})">–</button>
                        
                        <input type="text" class="no-bor font-w-700" value="${item.quantity}" readonly>
                        
                        <button class="btncss no-bor font-w-700" onclick="increase(${index})">+</button>
                    </div>
                </div>

                <p class="font-w-700 heading-pink font-price under-line absolute">
                    ${(item.price * item.quantity).toLocaleString("vi-VN")}đ
                </p>  
            </div> 
        </div>
        `;
    });

    cartContainer.innerHTML = html;
    countEl.innerText = totalQuantity + " Products";
    totalEl.innerText = total.toLocaleString("vi-VN") + "đ";
    finalEl.innerText = total.toLocaleString("vi-VN") + "đ";
}
document.addEventListener("DOMContentLoaded", renderCart);

window.increase = function (index) {
    let currentuser = JSON.parse(localStorage.getItem("currentUser"));
    let userKey = currentuser.email;

    let allCarts = JSON.parse(localStorage.getItem("cart")) || {};
    let cart = allCarts[userKey] || [];
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];

    let itemInCart = cart[index];
    let originProduct = allProducts.find(p => p.productID === itemInCart.productID);
    let currentStock = 0;

    if (originProduct) {
        originProduct.variants.forEach(variant => {
            let stockItem = variant.item.find(i => i.sku === itemInCart.sku);
            if (stockItem) {
                currentStock = stockItem.stock;
            }
        });
    }
    if (itemInCart.quantity < currentStock) {
        itemInCart.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    } else {
        alert(`Unfortunately, this product only has a maximum of ${currentStock} units left in stock.`);
    }
};

window.decrease = function (index) {
    let currentuser = JSON.parse(localStorage.getItem("currentUser"));
    let userKey = currentuser.email;

    let allCarts = JSON.parse(localStorage.getItem("cart")) || {};
    let cart = allCarts[userKey] || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

window.removeItem = function (index) {
    if (confirm("Do you want to delete it?")) {
        let currentuser = JSON.parse(localStorage.getItem("currentUser"));
        let userKey = currentuser.email;

        let allCarts = JSON.parse(localStorage.getItem("cart")) || {};
        let cart = allCarts[userKey] || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    } else {
        return;
    }
};

function paying() {
    let currentuser = JSON.parse(localStorage.getItem("currentUser"));
    let userKey = currentuser.email;

    let allCarts = JSON.parse(localStorage.getItem("cart")) || {};
    let cart = allCarts[userKey] || [];
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];

    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
    }
    for (let item of cart) {
        let originProduct = allProducts.find(p => p.productID === item.productID);
        let stockAvailable = 0;

        if (originProduct) {
            originProduct.variants.forEach(variant => {
                let stockItem = variant.item.find(i => i.sku === item.sku);
                if (stockItem) stockAvailable = stockItem.stock;
            });
        }

        if (item.quantity > stockAvailable) {
            alert(`The product "${item.name}" has exceeded the stock quantity (${stockAvailable}). Please adjust it!`);
            return;
        }
    }

    window.location.href = "../paying.html";
}