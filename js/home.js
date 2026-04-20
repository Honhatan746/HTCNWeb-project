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
        const trendContain = document.getElementById("trendingProducts");
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
// Render ra top sản phẩm
async function renderTop2Fashion(categories, container) {
    try {
        const res = await fetch("../data/Product.json");
        const data = await res.json();

        const top2Product = data.filter(item => item.categories === categories)
            .map(product => {
                const allPrices = product.variants.flatMap(v => v.item.map(i => i.price));
                const maxPrice = Math.max(...allPrices);
                return { ...product, topPrice: maxPrice };
            })
            .sort((a, b) => b.topPrice - a.topPrice)
            .slice(0, 2);
        const cardContainer = document.getElementById(container);
        if (!cardContainer) return; // Thoát nếu không tìm thấy container chứa card

        // Tạo chuỗi HTML trống
        let htmlContent = '';

        top2Product.forEach(product => {
            const displayImg = product.variants[0].image[0];

            htmlContent += `
                <div class="kcs-small-card product-card text-center">
                    <div class ="product-img-container">
                        <img src="${displayImg}" alt="${product.name}">
                    </div>
                    <p class="small mt-2 mb-1">${product.name}</p>
                    <p class="fw-bold heading-pink">${product.topPrice.toLocaleString('vi-VN')} đ</p>
                </div>
            `;
        });

        // Cập nhật lại giao diện
        cardContainer.innerHTML = htmlContent;

    } catch (error) {
        console.error("Lỗi khi tải dữ liệu JSON:", error);
    }
}
// Render ra danh sách sản phẩm
async function renderFashion(categories, container) {
    const res = await fetch("../data/Product.json");
    const data = await res.json();
    const girlProduct = data.filter(item => item.categories === categories);
    let html = "";
    const productSlider = document.getElementById(container);
    if (!productSlider) return;
    girlProduct.forEach(p => {
        html += `
            <a href="" class=" product-item product-card text-decoration-none">
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
        `
    })
    productSlider.innerHTML = html;

}
// List new
let newsData =[];
async function renderListNews(){
    try {
        const res = await fetch("../data/news.json");
        const data = await res.json();
        newsData = data;
        const news = data.slice(0,3);
        const newsList = document.getElementById("newsList");
        let html = "";
        news.forEach((item, index)=> {
            console.log(item);
            html += `
                <div class="col-md-4">
                    <div class="news-tab-item ${index === 0 ? 'active' : ''}" onclick="switchNews(this, ${index})">
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" class="tab-thumb" alt="">
                                <div class="ms-3">
                                    <h6 class="mb-0">${item.title}</h6>
                                    <small class="text-muted">${item.published}</small>
                                </div>
                            </div>
                    </div>
                </div>
            `;
        })
        newsList.innerHTML = html;
        if(newsData.length > 0) updatePrivew(newsData[0]);
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu JSON:", error);
    }
}
function updatePrivew(data){
    document.getElementById('previewImg').src = data.image;
    document.getElementById('previewTitle').innerText = data.title;
    document.getElementById('previewDesc').innerText = data.excerpt;
}
window.switchNews = function(element, index) {
    document.querySelectorAll('.news-tab-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    const preview = document.getElementById('mainPreview');
    const data = newsData[index];
    if(!data) return;
    preview.style.opacity = '0';
    preview.style.transform = 'translateY(10px)';
    preview.style.transition = '0.4s ease';

    setTimeout(() => {
        document.getElementById('previewImg').src = data.image;
        document.getElementById('previewTitle').innerText = data.title;
        document.getElementById('previewDesc').innerText = data.excerpt;

        preview.style.opacity = '1';
        preview.style.transform = 'translateY(0)';
    }, 400); 
}
document.addEventListener('DOMContentLoaded', () => {
        renderTop2Fashion("girlFashion", "clothes-girl-hot"),
        renderTop2Fashion("boyFashion", "clothes-boy-hot"),
        renderTop2Fashion("Accessories", "accessories-hot"),
        renderFashion("girlFashion", "product-slider-girl"),
        renderFashion("boyFashion", "product-slider-boy"),
        renderFashion("Accessories", "product-slider-access"),
        renderTrending(),
        renderListNews()
});
