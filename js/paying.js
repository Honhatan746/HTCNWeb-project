let currentuser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentuser) {
    if (confirm("Vui lòng đăng nhập")) {
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
    renderUser();
} else {
    function renderCheckout() {
        const container = document.querySelector(".paying-list");
        const totalEl = document.getElementById("total");
        const totalTempEl = document.getElementById("totalTem");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            container.innerHTML = "<p>Không có sản phẩm</p>";
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
        renderUser();
    }
    document.addEventListener("DOMContentLoaded", renderCheckout);
}
function renderUser(){
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
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // 👉 LẤY buyNow hoặc cart
    let buyNow = JSON.parse(localStorage.getItem("buyProduct"));
    let items = [];

    if (buyNow) {
        items = [buyNow]; // chuyển thành array
    } else {
        items = JSON.parse(localStorage.getItem("cart")) || [];
    }

    if (items.length === 0) {
        alert("Không có sản phẩm!");
        return;
    }

    // 👉 Tính tổng
    let total = items.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    const order = {
        orderID: "OD" + Date.now(),
        customer: { name, email, tel, address},
        items: items,
        total: total,
        status: "PENDING_DELIVERY",
        createdAt: new Date().toLocaleString("vi-VN")
    };

    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    if (buyNow) {
        localStorage.removeItem("buyProduct");
    } else {
        localStorage.removeItem("cart");
    }

    window.location.href = "order.html";
};