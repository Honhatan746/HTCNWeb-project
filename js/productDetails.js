/**
 * HÀM BỔ TRỢ: Đổi ảnh chính khi click vào thumbnail
 * Cần đưa vào window để HTML onclick có thể gọi được
 */
window.changeImage = function(imgElement) {
    const mainImg = document.getElementById("mainImg");
    if (mainImg) {
        // Hiệu ứng mờ nhẹ khi đổi ảnh
        mainImg.style.opacity = "0.5";
        setTimeout(() => {
            mainImg.src = imgElement.src;
            mainImg.style.opacity = "1";
        }, 150);
    }
};

/**
 * HÀM TĂNG GIẢM SỐ LƯỢNG
 */
window.subtract = function() {
    const input = document.getElementById("quantity");
    let val = parseInt(input.value);
    if (val > 1) input.value = val - 1;
};

window.add = function() {
    const input = document.getElementById("quantity");
    let val = parseInt(input.value);
    input.value = val + 1;
};

/**
 * HÀM CHÍNH: Tải dữ liệu và Render chi tiết sản phẩm
 */
let currentVariant = null;
let currentItem = null;
let product = null;
async function initProductDetail() {
    try {
        // 1. Fetch dữ liệu từ file JSON (Sửa đường dẫn phù hợp với project của bạn)
        const response = await fetch("../data/Product.json");
        const products = await response.json();

        // 2. Lấy ID sản phẩm từ URL (ví dụ: ?id=AF01)
        const params = new URLSearchParams(window.location.search);
        const productID = params.get("id");

        if (!productID) {
            console.error("Không tìm thấy ID sản phẩm trên URL");
            return;
        }

        // 3. Tìm sản phẩm trong mảng dữ liệu
        product = products.find(p => p.productID === productID);
        if (!product) {
            document.body.innerHTML = "<h2 style='text-align:center; margin-top:50px;'>Sản phẩm không tồn tại!</h2>";
            return;
        }

        // BIẾN LƯU TRỮ TRẠNG THÁI HIỆN TẠI
        currentVariant = product.variants[0]; // Mặc định màu đầu tiên
        currentItem = currentVariant.item[0];  // Mặc định size đầu tiên

        // 4. RENDER THÔNG TIN CƠ BẢN TĨNH
        document.getElementById("prodcutDTName").innerText = product.name;
        renderModernProductDetail(product);

        // 5. HÀM RENDER SIZE (Gọi lại mỗi khi đổi màu)
const renderSizes = () => {
    const boxSize = document.getElementById("prodcutDTSize");
    const sizeSection = document.getElementById("sizeSection");

    if (!boxSize) return;

    // Trường hợp 1: Sản phẩm không có size (Phụ kiện) -> Hiện nút mua ngay lập tức
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

        // 6. HÀM RENDER THUMBNAILS (Gọi lại mỗi khi đổi màu)
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

        // 7. LẬP TRÌNH CÁC HÀM TƯƠNG TÁC (Gắn vào window)
        
        // CHỌN MÀU
        window.selectColor = function(index) {
            currentVariant = product.variants[index];
            currentItem = currentVariant.item[0]; // Reset về size đầu tiên của màu mới

            // Cập nhật ảnh chính (Dùng đúng ID prodcutDTMainImg của bạn)
            const mainImgContainer = document.getElementById("prodcutDTMainImg");
            mainImgContainer.innerHTML = `<img id="mainImg" class="img-cls wid-100" src="${currentVariant.image[0]}" alt="main">`;

            // Cập nhật Giá và Mã SKU
            document.getElementById("productDTPrice").innerText = currentItem.price.toLocaleString("vi-VN") + "đ";
            document.getElementById("prodcutDTID").innerText = currentItem.sku;

            renderThumbnails(currentVariant);
            renderSizes();
        };

        // CHỌN SIZE
window.selectSize = function(index) {
    // 1. Gán item hiện tại dựa trên size vừa chọn
    currentItem = currentVariant.item[index];

    // 2. Cập nhật giao diện Giá và SKU
    document.getElementById("productDTPrice").innerText = currentItem.price.toLocaleString("vi-VN") + "đ";
    document.getElementById("prodcutDTID").innerText = currentItem.sku;

    // 3. HIỆN NÚT MUA, ẨN NÚT NHẮC NHỞ
    const btnReads = document.querySelectorAll(".btn-read");
    const btnBuys = document.querySelectorAll(".btn-mua");

    btnReads.forEach(btn => btn.style.display = "none");
    btnBuys.forEach(btn => btn.style.display = "block");

    // 4. Vẽ lại danh sách size để cập nhật class 'active' (màu sắc nút size)
    renderSizes();
};

        // 8. RENDER DANH SÁCH MÀU SẮC (Lần đầu load trang)
        const colorContain = document.getElementById("productDTcolor");
        let colorHtml = "";
        product.variants.forEach((v, index) => {
            colorHtml += `
                <img class="pointer img-cls" src="${v.image[0]}" 
                     onclick="window.selectColor(${index})" 
                     style="width: 50px; height: 50px; margin-right: 10px; border-radius: 5px; cursor: pointer; border: 1px solid #ddd;">`;
        });
        colorContain.innerHTML = colorHtml;

        // 9. KÍCH HOẠT HIỂN THỊ MẶC ĐỊNH
        window.selectColor(0);

    } catch (error) {
        console.error("Lỗi khi tải chi tiết sản phẩm:", error);
    }
}
function renderModernProductDetail(product) {
    if (!product) return;

    const container = document.getElementById("productDetail");

    const mainImg = product?.variants?.[0]?.image?.[0] || "";

    // parse description
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
            <p class="product-subtitle">Product Detail</p>
            <h1 class="product-big-title">${product.name}</h1>

            <div class="product-desc">
                ${descHTML}
            </div>

            <button class="btn-order">Order Now</button>
        </div>

        <!-- RIGHT -->
        <div class="col-lg-6 product-right">

            <div class="product-image-wrapper">
                <img src="${mainImg}" class="main-product-img" />
            </div>

            <div class="mini-card">
                <img src="${mainImg}" />
            </div>

            <div class="vertical-badge">
                New Arrivals
            </div>

        </div>
    `;
}
// Chạy hàm khi trang web tải xong
document.addEventListener("DOMContentLoaded", initProductDetail);

window.addToCart = function () {
    if (!currentItem) {
        alert("Vui lòng chọn size!");
        return;
    }

    const quantityInput = document.getElementById("quantity");
    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra sản phẩm đã tồn tại chưa (dựa vào SKU)
    const index = cart.findIndex(item => item.sku === currentItem.sku);

    if (index !== -1) {
        cart[index].quantity += quantity;
    } else {
        cart.push({
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

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm vào giỏ hàng!");
};