window.changeImage = function (imgElement) {
    const mainImg = document.getElementById("mainImg");
    if (mainImg) {
        mainImg.style.opacity = "0.2";
        setTimeout(() => {
            mainImg.src = imgElement.src;
            mainImg.style.opacity = "1";
        }, 250);
    }
};

// Giảm số lượng
window.subtract = function () {
    const input = document.getElementById("quantity");
    let val = parseInt(input.value);

    if (val > 1) {
        input.value = val - 1;
    }
};
// Tăng số lượng
window.add = function () {
    const input = document.getElementById("quantity");
    let val = parseInt(input.value);

    if (!currentItem) {
        alert("Size please!");
        return;
    }

    if (val >= currentItem.stock) {
        alert("Only " + currentItem.stock + " products in stock!");
        return;
    }

    input.value = val + 1;
};
// Render chi tiết sản phẩm
let currentVariant = null;
let currentItem = null;
let product = null;
async function initProductDetail() {
    try {
        let products = JSON.parse(localStorage.getItem("products"));
        console.log(products);
        if (!products) {
            const response = await fetch("../data/Product.json");
            products = await response.json();
            localStorage.setItem("products", JSON.stringify(products));
        }
        const params = new URLSearchParams(window.location.search);
        const productID = params.get("id");

        if (!productID) {
            console.error("Not find ID products in URL");
            return;
        }

        // Tìm sản phẩm
        product = products.find(p => p.productID === productID);
        if (!product) {
            document.body.innerHTML = "<h2 style='text-align:center; margin-top:50px;'>not found products!</h2>";
            return;
        }
        currentVariant = product.variants[0];
        currentItem = currentVariant.item[0];

        document.getElementById("prodcutDTName").innerText = product.name;
        document.querySelector(".nameProduct").innerText = product.name
        renderModernProductDetail(product);
        if (product.sizeTable === undefined) {
            document.getElementById("tableDTSize").innerHTML = "";
        } else {
            document.getElementById("tableDTSize").innerHTML = product.sizeTable;
        }
        // Hàm render ra size 
        const renderSizes = () => {
            const boxSize = document.getElementById("prodcutDTSize");
            const sizeSection = document.getElementById("sizeSection");

            if (!boxSize) return;

            // Sản phẩm không có size 
            if (currentVariant.item.length === 1 && !currentVariant.item[0].size) {
                if (sizeSection) sizeSection.style.display = "none";
                return;
            }
            let sizeHtml = "";
            currentVariant.item.forEach((item, index) => {
                const activeClass = (currentItem && currentItem.sku === item.sku) ? "active" : "";
                sizeHtml += `
            <div class="btncss ${activeClass}" onclick="window.selectSize(${index})">
                ${item.size}
            </div>`;
            });
            boxSize.innerHTML = sizeHtml;
        };

        const renderThumbnails = (variant) => {
            const list = document.getElementById("productDTList");
            let thumbHtml = "";
            variant.image.forEach(img => {
                thumbHtml += `
                    <div class="product-dt_list_img">
                        <img src="${img}" onclick="window.changeImage(this)" alt="thumb">
                    </div>`;
            });
            list.innerHTML = thumbHtml;
        };
        // Chọn màu
        window.selectColor = function (index) {
            currentVariant = product.variants[index];
            currentItem = currentVariant.item[0];

            const mainImgContainer = document.getElementById("prodcutDTMainImg");
            mainImgContainer.innerHTML = `<img id="mainImg" class="img-cls wid-100" src="${currentVariant.image[0]}" alt="main">`;
            document.querySelector(".color-span").innerHTML = currentVariant.color;
            if (/^White$/i.test(currentVariant.color)) {
                document.querySelector(".color-span").style.color = "black";
            } else {
                document.querySelector(".color-span").style.color = currentVariant.color;
            }
            document.getElementById("productDTPrice").innerText = currentItem.price.toLocaleString("vi-VN") + "đ";
            document.getElementById("prodcutDTID").innerText = currentItem.sku;

            renderThumbnails(currentVariant);
            renderSizes();
        };

        // Chọn size
        window.selectSize = function (index) {
            currentItem = currentVariant.item[index];

            document.getElementById("productDTPrice").innerText =
                currentItem.price.toLocaleString("vi-VN") + "đ";
            document.getElementById("prodcutDTID").innerText = currentItem.sku;
            document.getElementById("quantity").value = 1;

            const btnReads = document.querySelectorAll(".btn-read");
            const btnBuys = document.querySelectorAll(".btn-mua");

            btnReads.forEach(btn => btn.style.display = "none");
            btnBuys.forEach(btn => btn.style.display = "block");

            renderSizes();
        };
        const colorContain = document.getElementById("productDTcolor");
        let colorHtml = "";
        product.variants.forEach((v, index) => {
            colorHtml += `
                <img class="pointer img-cls" src="${v.image[0]}" 
                     onclick="window.selectColor(${index})" 
                     style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; cursor: pointer; border: 1px solid #ddd;">`;
        });
        colorContain.innerHTML = colorHtml;
        window.selectColor(0);

    } catch (error) {
        console.error("Error loading product details:", error);
    }

    console.log(currentItem);
}
function renderModernProductDetail(product) {
    if (!product) return;
    const container = document.getElementById("productDetail");
    const mainImg = product?.variants?.[0]?.image?.[0] || "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = product.descirption || "";
    const listItems = tempDiv.querySelectorAll("li.mar-t-b");

    let descHTML = "";

    if (listItems.length > 0) {
        listItems.forEach(item => {
            const title = item.querySelector("p.font-w-700")?.innerText || "";
            const details = item.querySelector("ul")?.innerHTML || "";

            descHTML += `
                <div class="desc-block">
                    <h5>${title}</h5>
                    <ul>${details}</ul>
                </div>
            `;
        });
    } else {
        descHTML = `<p>${product.descirption || "No description available"}</p>`;
    }

    container.innerHTML = `
        <!-- LEFT -->
        <div class="col-lg-6 product-left">
            <h1 class="product-big-title">${product.name}</h1>

            <div class="product-desc">
                ${descHTML}
            </div>
        </div>

        <!-- RIGHT -->
        <div class="col-lg-6 product-right">

            <div class="product-image-wrapper">
                <img src="${mainImg}" class="main-product-img" />
            </div>

            <div class="mini-card">
                <img src="${mainImg}" />
            </div>

        </div>
    `;
}
document.addEventListener("DOMContentLoaded", () => {
    initProductDetail(),
        buyNow()
});

window.addToCart = function () {
    let currentuser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentuser) {
        if (confirm("Please login to add products to cart!")) {
            window.location.href = "../login.html";
        }
        return;
    }
    let userKey = currentuser.email;
    let allCarts = JSON.parse(localStorage.getItem("cart")) || {};

    if (!allCarts[userKey]) {
        allCarts[userKey] = [];
    }
    // Kiểm tra trùng sản phẩm trong giỏ hàng của mỗi người
    let userCart = allCarts[userKey];
    let existingItem = userCart.find(item => item.sku === currentItem.sku);

    const quantityInput = document.getElementById("quantity");
    const quantity = parseInt(quantityInput.value);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        userCart.push({
            productID: product.productID,
            name: product.name,
            sku: currentItem.sku,
            size: currentItem.size,
            color: currentVariant.color,
            price: currentItem.price,
            image: currentVariant.image[0],
            quantity: quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(allCarts));
    alert("Added to your personal cart!");
};
window.buyNow = function () {
    if (localStorage.getItem("buyProduct")) {
        localStorage.removeItem("buyProduct");
    }
    let buyNowBtn = document.getElementById("buyNow");
    if (!buyNowBtn) return;

    buyNowBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!localStorage.getItem("currentUser")) {
            if (confirm("Please log in to make a purchase!")) {
                window.location.href = "../login.html";
            }
            return;
        }

        if (!currentItem) {
            alert("Please select your size before purchasing.!");
            return;
        }
        const quantityInput = document.getElementById("quantity");
        const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

        if (isNaN(quantity) || quantity <= 0) {
            alert("Invalid quantity!");
            return;
        }
        if (quantity > currentItem.stock) {
            alert(`Unfortunately, this product only has a maximum of ${currentItem.stock} units left in stock.`);
            return;
        }
        buyNowBtn.disabled = true;
        buyNowBtn.textContent = "Loading...";

        setTimeout(() => {
            let buyProduct = {
                productID: product.productID,
                name: product.name,
                sku: currentItem.sku,
                size: currentItem.size,
                color: currentVariant.color,
                price: currentItem.price,
                stock: currentItem.stock,
                image: currentVariant.image[0],
                quantity: quantity
            };

            localStorage.setItem("buyProduct", JSON.stringify(buyProduct));
            window.location.href = "../paying.html";
            buyNowBtn.disabled = false;
            buyNowBtn.textContent = "Buy now";
        }, 1000);
    });
}