// Render ra trending sản phẩm
async function renderTrending() {
    try {
        const res = await fetch("../data/Product.json");
        const data = await res.json();

        const topProduct = data.map(product => {
            const allPrices = product.variants.flatMap(v => v.item.map(i => i.price));
            const maxPrice = Math.max(...allPrices);
            return { ...product, topPrice: maxPrice };
        })
            .sort((a, b) => b.topPrice - a.topPrice)
            .slice(0, 8);
        const trendContain = document.getElementById("showcaselist");
        if (!trendContain) return;
        let html = "";
        topProduct.forEach(p => {
            html += `
            <div class="col-6 col-md-4 col-lg-3">
                 <a href="../productDetail.html?id=${p.productID}" class=" product-item product-card text-decoration-none">
                <div  class=" cart h-100 border-0 shadow-sm">
                    <div class="product-img-container frame_img">
                        <img src="${p.variants[0].image[0]}" class=" img-cls" alt="${p.name}">
                    </div>
                    <div class=" cart_text card-title text-center">
                        <h3 class="  mb-2">${p.name}</h3>
                        <h3 class=" fw-bold heading-pink ">${p.variants[0].item[0].price.toLocaleString('vi-VN')} đ</h3>
                        <div class="frame_img cart-color"><img class="img-cls" src="${p.variants[0].image[1]}"></div>       
                    </div>
                </div>
                </a>
            </div>
            `
        })
        trendContain.innerHTML = html;
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu JSON:", error);
    }
}
document.addEventListener("DOMContentLoaded", renderTrending);