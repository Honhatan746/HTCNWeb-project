function translateStatus(status) {
    switch (status) {
        case "PENDING_DELIVERY": return "Chờ giao";
        case "DELIVERING": return "Đang giao";
        case "COMPLETED": return "Đơn hoàn thành";
        case "CANCELED": return "Đã hủy";
        default: return "Không xác định";
    }
}

function formatPrice(price) {
    return price.toLocaleString("vi-VN") + "đ";
}

function renderOrders() {
    const container = document.getElementById("orderContainer");
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
console.log(orders);
    if (orders.length === 0) {
        container.innerHTML = "<p>Chưa có đơn hàng</p>";
        return;
    }

    let html = "";

    orders.forEach(order => {

         html += `
                <div class="card order-card shadow-sm mb-4">
                    <div class="card-body p-4">

                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <span class="text-muted" style="font-size: 1.3rem;">Mã đơn:</span>
                                <strong style="font-size: 1.5rem; color: var(--color-price);">#${order.orderID}</strong>
                            </div>
                            <span class="badge status-badge" style="background-color: #fff3cd; color: #856404; border: 1px solid #ffeeba;">
                                ${translateStatus(order.status)}
                            </span>
                        </div>

                        ${order.items.map(item => `
                            <div class="d-flex align-items-center mb-3 pb-3 border-bottom" style="border-bottom-style: dashed !important;">
                            
                                <div style="width:150px; height:150px; margin-right:10px;">
                            <img src="${item.image}" style="width:100%; height:100%; object-fit:cover;">
                                </div>

                                <div class="flex-grow-1">
                                    <div class="product-name">${item.name}</div>
                                    <small class="text-muted">
                                        ${item.size ? `Size: <span class="text-dark">${item.size}</span>` : ""}
                                        Color: <span class="text-dark">${item.color}</span>
                                    </small><br>
                                    <small class="fw-bold">x${item.quantity}</small>
                                </div>

                                <div class="text-end">
                                    <strong style="font-size: 1.6rem;">${formatPrice(item.price)}</strong>
                                </div>

                            </div>
                        `).join("")}

                        <div class="mb-4 p-3 rounded" style="background-color: #fcfaff; border: 1px solid #f0e6ff;">
                            <div class="mb-1 text-muted" style="font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.5px;">Thông tin nhận hàng</div>
                            <div style="font-size: 1.4rem;"><strong>${order.customer.name}</strong> | ${order.customer.tel}</div>
                            <div class="text-muted" style="font-size: 1.3rem;">${order.customer.address}</div>
                        </div>

                        <div class="total-section">
                            <div class="d-flex justify-content-between fw-bold pt-2 border-top">
                                <span style="font-size: 1.6rem;">Tổng cộng:</span>
                                <span class="total-amount">${formatPrice(order.total)}</span>
                            </div>
                        </div>

                        <div class="mt-4 d-flex justify-content-end gap-2">
                            
                            ${order.status === "DELIVERING" || order.status === "PENDING_DELIVERY" ?`
                                <button class="btn btn-confirm-order btn-sm" onclick="confirmReceived('${order.orderID}')">
                                        Xác nhận đã nhận hàng
                                </button>
                            ` : ""}

                            <button class="btn btn-outline-danger btn-sm" 
                                ${order.status !== "PENDING_PAYMENT" && order.status !== "PENDING_DELIVERY" ? "disabled" : ""} 
                                onclick="cancelOrder('${order.orderID}')">
                                Hủy đơn
                            </button>
                        </div>

                    </div>
                </div>
                `;
    });

    container.innerHTML = html;
}
// Đã nhận hàng
window.confirmReceived = function (orderID) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const index = orders.findIndex(o => o.orderID === orderID);
    if (index === -1) return;

    orders[index].status = "COMPLETED";

    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
};
// Hủy đơn
window.cancelOrder = function (orderID) {
    if (!confirm("Bạn chắc chắn muốn hủy đơn?")) return;

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const index = orders.findIndex(o => o.orderID === orderID);
    if (index === -1) return;

    orders[index].status = "CANCELED";

    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
};
document.addEventListener("DOMContentLoaded", renderOrders);