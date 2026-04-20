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

    // 👉 cập nhật tổng tiền
    totalTempEl.innerText = total.toLocaleString("vi-VN") + "đ";
    totalEl.innerText = total.toLocaleString("vi-VN") + "đ";
}
document.addEventListener("DOMContentLoaded", renderCheckout);

window.creatOrder = function () {
    // Lấy dữ liệu từ form
    const name = document.getElementById("payingName").value.trim();
    const email = document.getElementById("payingEmail").value.trim();
    const tel = document.getElementById("payingTel").value.trim();
    const address = document.getElementById("payingAddress").value.trim();
    const country = document.getElementById("payingCountruy").value.trim();

    // 👉 VALIDATE
    if (!name || !email || !tel || !address || !country) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // 👉 Lấy giỏ hàng
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        return;
    }

    // 👉 Tạo mã đơn hàng (random đơn giản)
    const orderID = "OD" + Date.now();

    // 👉 Tính tổng tiền
    let total = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    // 👉 Tạo object order
    const order = {
        orderID: orderID,
        customer: {
            name,
            email,
            tel,
            address,
            country
        },
        items: cart,
        total: total,
        status: "PENDING_DELIVERY",
        createdAt: new Date().toLocaleString("vi-VN")
    };

    // 👉 Lưu vào localStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    // 👉 Xóa giỏ hàng
    localStorage.removeItem("cart");

    // 👉 Chuyển trang
    window.location.href = "order.html";
};