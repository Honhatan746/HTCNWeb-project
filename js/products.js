let allData = []; // Lưu toàn bộ mảng sản phẩm từ JSON
let currentProduct = []; // Dữ liệu dùng để hiển thị (sau khi lọc/sắp xếp)
let currentPage = 1;
const productPerPage = 9;

async function loadAllProduct() {
    try {
        const res = await fetch("../data/Product.json");
        const data = await res.json();

        allData = data;

        // --- PHẦN THÊM MỚI: Xử lý tham số từ URL ---
        const params = new URLSearchParams(window.location.search);
        const categoryFromUrl = params.get("cat");

        if (categoryFromUrl) {
            // Lọc dữ liệu ngay khi tải trang
            currentProduct = allData.filter(p => p.categories === categoryFromUrl);
            
            // Tự động làm sáng nút filter tương ứng (nếu có)
            // Giả sử các nút filter của bạn có thuộc tính onclick chứa tên category
            setTimeout(() => {
                const filterBtns = document.querySelectorAll('.btn-filter');
                filterBtns.forEach(btn => {
                    // Kiểm tra xem nội dung onclick có chứa category không
                    if (btn.getAttribute('onclick').includes(`'${categoryFromUrl}'`)) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }, 100); 

        } else {
            // Nếu không có tham số, hiện tất cả và active nút "All"
            currentProduct = [...allData];
            const btnAll = document.querySelector('.btn-filter[onclick*="all"]');
            if(btnAll) btnAll.classList.add('active');
        }
        // ------------------------------------------

        renderPage(1);
    } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
    }
}

// Hàm hiển thị sản phẩm cho mỗi trang
function renderPage(page) {
    currentPage = page;
    const startIndex = (page - 1) * productPerPage;
    const endIndex = startIndex + productPerPage;
    const pagedItems = currentProduct.slice(startIndex, endIndex);

    const productGrid = document.getElementById("productGrid");
    let html = "";

    pagedItems.forEach(p => {
        // Tạo các chấm màu (swatches)
        const colorSwatches = p.variants.map(v => `
            <span class="swatch" 
                  style="background-color: ${v.color.toLowerCase()};" 
                  onmouseover="changeCardImage('img-${p.productID}', '${v.image[0]}')"
                  title="${v.color}">
            </span>
        `).join("");

        html += `
    <a href="../productDetail.html?id=${p.productID}" class="col-12 col-sm-6 col-lg-4 mb-5 text-decoration-none"> 
        <div class="product-card card border-0 shadow-sm h-100 p-3">
            <div class="position-relative overflow-hidden rounded-4 product-img-container">
                    <img id="img-${p.productID}" src="${p.variants[0].image[0]}" 
                    class="card-img-top object-fit-cover" 
                    style="height: 400px;" alt="${p.name}">
            </div>
            
            <div class="card-body px-1 pt-3 pb-0">
                <small class="text-muted text-uppercase tracking-wider" style="font-size: 1.3rem;">
                    ${translateCategory(p.categories)}
                </small>
                <h5 class="card-title text-truncate mt-1 mb-2 fw-bold font-price" title="${p.name}">
                    ${p.name}
                </h5>
                <p class="fw-bold text-pink mb-3 font-price heading-pink">
                    ${Number(p.variants[0].item[0].price).toLocaleString()}đ
                </p>
                
                <div class="color-swatches d-flex gap-2 mb-2">
                    ${colorSwatches}
                </div>
            </div>
        </div>
    </a>
`;
    });

    productGrid.innerHTML = html || `<div class="text-center w-100 py-5">Không có sản phẩm nào.</div>`;
    renderPagination();
}

// Thay đổi ảnh khi di chuột qua màu
window.changeCardImage = function (imgId, newSrc) {
    const img = document.getElementById(imgId);
    if (img) img.src = newSrc;
}

// Logic phân trang
function renderPagination() {
    const totalPages = Math.ceil(currentProduct.length / productPerPage);
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link font-title px-4 rounded-5"  href="#" onclick="event.preventDefault(); renderPage(${i})">${i}</a>
            </li>
        `;
    }
    pagination.innerHTML = html;
}

// Logic Bộ lọc (Filter)
window.filterCategory = function(category, element) {
    // 1. Cập nhật class active cho nút
    const buttons = document.querySelectorAll('.btn-filter');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    // 2. Lọc sản phẩm
    if (category === 'all') {
        currentProduct = [...allData];
        // Xóa tham số cat trên URL cho sạch
        window.history.pushState({}, '', window.location.pathname);
    } else {
        currentProduct = allData.filter(p => p.categories === category);
        // Cập nhật tham số cat lên URL mà không load lại trang
        window.history.pushState({}, '', `?cat=${category}`);
    }

    renderPage(1);
}

// Logic Sắp xếp (Sort)
window.sortProducts = function () {
    const sortType = document.getElementById("priceSort").value;

    if (sortType === "asc") {
        currentProduct.sort((a, b) => a.variants[0].item[0].price - b.variants[0].item[0].price);
    } else if (sortType === "desc") {
        currentProduct.sort((a, b) => b.variants[0].item[0].price - a.variants[0].item[0].price);
    }
    renderPage(1);
}

function translateCategory(cat) {
    const map = { 'girlFashion': 'Bé Gái', 'boyFashion': 'Bé Trai', 'Accessories': 'Phụ Kiện' };
    return map[cat] || cat;
}

document.addEventListener("DOMContentLoaded", loadAllProduct);