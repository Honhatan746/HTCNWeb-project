let currentBuyNow = JSON.parse(localStorage.getItem("buyProduct"));
if (currentBuyNow) {
    localStorage.removeItem("buyProduct");
}
console.log(currentBuyNow);
function renderCart() {
    const cartContainer = document.getElementById("cart-List");
    const countEl = document.getElementById("cart-count");
    const totalEl = document.getElementById("total-price");
    const finalEl = document.getElementById("final-price");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log(cart);
    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Giỏ hàng trống</p>";
        countEl.innerText = "0 sản phẩm";
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
    countEl.innerText = totalQuantity + " sản phẩm";
    totalEl.innerText = total.toLocaleString("vi-VN") + "đ";
    finalEl.innerText = total.toLocaleString("vi-VN") + "đ";
}
document.addEventListener("DOMContentLoaded", renderCart);

window.increase = function (index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
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
        alert(`Rất tiếc, sản phẩm này chỉ còn tối đa ${currentStock} cái trong kho.`);
    }
};

window.decrease = function (index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
};

window.removeItem = function (index) {
    if(confirm("Bạn có muốn xóa không?")){
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    }else{
        return;
    }
};

function paying() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let allProducts = JSON.parse(localStorage.getItem("products")) || [];
    
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống!");
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
            alert(`Sản phẩm "${item.name}" đã vượt quá số lượng trong kho (${stockAvailable}). Vui lòng điều chỉnh lại!`);
            return;
        }
    }

    window.location.href = "../paying.html";
}