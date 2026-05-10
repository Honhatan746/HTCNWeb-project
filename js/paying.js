async function initProducts() {
    if (!localStorage.getItem("products")) {
        try {
            const response = await fetch("../data/Product.json");
            const data = await response.json();
            localStorage.setItem("products", JSON.stringify(data));
        } catch (error) {
            console.error("Unable to load product data:", error);
        }
    }
}
document.addEventListener("DOMContentLoaded", initProducts);

let currentuser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentuser) {
    if (confirm("Login please!")) {
        window.location.href = "../login.html";
    } else {
        window.location.href = "../home.html";
    }
}

let currentBuyNow = JSON.parse(localStorage.getItem("buyProduct")) || "";
if (currentBuyNow) {
    console.log(currentBuyNow);
    const container = document.querySelector(".paying-list");
    const totalEl = document.getElementById("total");
    const totalTempEl = document.getElementById("totalTem");
    const totalMobile = document.getElementById("totalMobile");

    let html = "";
    let total = 0;

    const itemTotal = currentBuyNow.price * currentBuyNow.quantity;
    total += itemTotal;

    html += `
        <div class="paying-item di-flex alignItem-cen wid-100 justi-btw bo-bot mar-t-b">
            
            <div class="di-flex alignItem-cen">
                <div class="frame_img paying-item-img">
                    <img class="img-cls" src="${currentBuyNow.image}" alt="">
                    <div class="absolute">${currentBuyNow.quantity}</div>
                </div>

                <div>
                    <p class="font-price">${currentBuyNow.name}</p>
                    ${currentBuyNow.size ? `<p>Size: ${currentBuyNow.size}</p>` : ""}
                    ${currentBuyNow.color ? `<p>Color: ${currentBuyNow.color}</p>` : ""}
                </div>
            </div>

            <p>${itemTotal.toLocaleString("vi-VN")}đ</p>
        </div>
        `;
    container.innerHTML = html;
    totalTempEl.innerText = total.toLocaleString("vi-VN") + "đ";
    totalEl.innerText = total.toLocaleString("vi-VN") + "đ";
    totalMobile.innerHTML = total.toLocaleString("vi-VN") + "đ";
    renderUser();
} else {
    function renderCheckout() {
        const container = document.querySelector(".paying-list");
        const totalEl = document.getElementById("total");
        const totalTempEl = document.getElementById("totalTem");
        const totalMobile = document.getElementById("totalMobile");

        let currentuser = JSON.parse(localStorage.getItem("currentUser"));
        let userKey = currentuser.email;

        let allCarts = JSON.parse(localStorage.getItem("cart")) || {};
        let cart = allCarts[userKey] || [];

        if (cart.length === 0) {
            container.innerHTML = "<p>There are no products</p>";
            return;
        }

        let html = "";
        let total = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            html += `
        <div class="paying-item di-flex alignItem-cen wid-100 justi-btw bo-bot mar-t-b">
            
            <div class="di-flex alignItem-cen">
                <div class="frame_img paying-item-img">
                    <img class="img-cls" src="${item.image}" alt="">
                    <div class="absolute">${item.quantity}</div>
                </div>

                <div>
                    <p class="font-price">${item.name}</p>
                    ${item.size ? `<p>Size: ${item.size}</p>` : ""}
                    ${item.color ? `<p>Color: ${item.color}</p>` : ""}
                </div>
            </div>

            <p>${itemTotal.toLocaleString("vi-VN")}đ</p>
        </div>
        `;
        });

        container.innerHTML = html;
        totalTempEl.innerText = total.toLocaleString("vi-VN") + "đ";
        totalEl.innerText = total.toLocaleString("vi-VN") + "đ";
        totalMobile.innerHTML = total.toLocaleString("vi-VN") + "đ";
        renderUser();
    }
    document.addEventListener("DOMContentLoaded", renderCheckout);
}
function renderUser() {
    console.log(currentuser);
    let address = currentuser.ward.name + "/" + currentuser.district.name + "/" + currentuser.province.name;
    document.getElementById("payingName").value = currentuser.name;
    document.getElementById("payingEmail").value = currentuser.email;
    document.getElementById("payingTel").value = currentuser.phone;
    document.getElementById("payingAddress").value = address;


}
window.creatOrder = function () {
    const name = document.getElementById("payingName").value.trim();
    const email = document.getElementById("payingEmail").value.trim();
    const tel = document.getElementById("payingTel").value.trim();
    const address = document.getElementById("payingAddress").value.trim();

    if (!name || !email || !tel || !address) {
        alert("Please enter all the required information!");
        return;
    }
    let currentuser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentuser) return;
    let userKey = currentuser.email;
    
    let buyNow = JSON.parse(localStorage.getItem("buyProduct"));
    let items = [];

    if (buyNow) {
        items = [buyNow];
    } else {
        let allCarts = JSON.parse(localStorage.getItem("cart")) || {};
        items = allCarts[userKey] || [];
    }
    if (items.length === 0) {
        alert("There are no products!");
        return;
    }
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];

    let isStockAvailable = true;
    let errorMessages = [];

    items.forEach(orderItem => {
        let product = allProducts.find(p => p.productID === orderItem.productID);
        if (product) {
            product.variants.forEach(variant => {
                let stockItem = variant.item.find(i => i.sku === orderItem.sku);
                if (stockItem) {
                    if (stockItem.stock < orderItem.quantity) {
                        isStockAvailable = false;
                        errorMessages.push(`The product ${orderItem.name} (Size ${orderItem.size}) only has ${stockItem.stock} products left.`);
                    }
                }
            });
        }
    });

    if (!isStockAvailable) {
        alert("Đặt hàng thất bại:\n" + errorMessages.join("\n"));
        return;
    }
    items.forEach(orderItem => {
        let product = allProducts.find(p => p.productID === orderItem.productID);
        product.variants.forEach(variant => {
            let stockItem = variant.item.find(i => i.sku === orderItem.sku);
            if (stockItem) {
                stockItem.stock -= orderItem.quantity;
            }
        });
    });
    localStorage.setItem("products", JSON.stringify(allProducts));

    let total = items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    let allOrders = JSON.parse(localStorage.getItem("orders")) || {};

    console.log(allOrders);
    const order = {
        orderID: "OD" + Date.now(),
        customer: { name, email, tel, address },
        items: items,
        total: total,
        status: "PENDING_DELIVERY",
        createdAt: new Date().toLocaleString("vi-VN")
    };

    if (!allOrders[userKey]) {
        allOrders[userKey] = [];
    }

    allOrders[userKey].push(order);
    localStorage.setItem("orders", JSON.stringify(allOrders));
    if (buyNow) {
        localStorage.removeItem("buyProduct");
    } else {
        let allCarts = JSON.parse(localStorage.getItem("cart")) || {};
        delete allCarts[userKey];
        localStorage.setItem("cart", JSON.stringify(allCarts));
    }
    window.location.href = "order.html";
};