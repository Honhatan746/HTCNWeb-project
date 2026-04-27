async function loadNews() {
    try {
        const response = await fetch("../data/news.json");
        const newsData = await response.json();

        // --- XỬ LÝ DỮ LIỆU ---
        // 1. Sắp xếp tin tức theo ngày (published) mới nhất
        const sortedNews = [...newsData].sort((a, b) => {
            return new Date(b.published.replace(/_/g, '-')) - new Date(a.published.replace(/_/g, '-'));
        });

        // 2. Lấy 6 bài mới nhất cho cột bên phải
        const top6News = sortedNews.slice(0, 6);

        // --- RENDER CỘT TRÁI (Giữ nguyên logic chia đôi của bạn) ---
        renderLeftColumn(newsData);

        // --- RENDER CỘT PHẢI (6 bài mới nhất) ---
        renderRightColumn(top6News);

    } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
    }
}

function renderRightColumn(newsList) {
    const hotNewsInner = document.getElementById("hotNewsSliderInner");
    let htmlContent = "";

    newsList.forEach((news, index) => {
        const isActive = index === 0 ? "active" : "";
        htmlContent += `
            <div class="carousel-item ${isActive}">
                <div class="hot-news-card p-4 shadow-sm text-center border-0">
                    <div class="img-frame mb-3 mx-auto" style="max-width: 100%; height: 250px;">
                        <img src="${news.image}" class="img-fluid w-100 h-100 object-fit-cover" alt="${news.title}">
                    </div>
                    <span class="badge read-next-news rounded-pill mb-2 px-3 fs-4">${news.published}</span>
                    <h4 class="fw-bold text-truncate-2 fs-2">${news.title}</h4>
                    <p class="text-muted small px-2 text-truncate-3 fs-4">${news.excerpt}</p>
                    <div class="mt-3">
                        <a href="newsDetail.html?id=${news.id}" class="btn btn-news rounded-pill px-4 fs-4">Xem chi tiết</a>
                    </div>
                </div>
            </div>
        `;
    });

    hotNewsInner.innerHTML = htmlContent;
}

// Hàm bổ trợ render cột trái (chia 2 bài mỗi slide)
function renderLeftColumn(data) {
    const sliderInner = document.getElementById("newsSliderInner");
    let htmlContent = "";
    for (let i = 0; i < data.length; i += 2) {
        const isActive = i === 0 ? "active" : "";
        const newsPair = data.slice(i, i + 2);
        let pairHtml = "";
        newsPair.forEach(news => {
            pairHtml += `
                <div class="featured-news-item mb-4  p-3 shadow-sm border-0">
                    <div class="row align-items-center">
                        <div class="col-md-5">
                            <div class="img-frame"><img src="${news.image}" class="img-fluid rounded-4"></div>
                        </div>
                        <div class="col-md-7">
                            <span class="category-tag">${news.headding}</span>
                            <h5 class="fw-bold mt-2 font-title">${news.title}</h5>
                            <a href="../newsDetail.html?id=${news.id}" class="read-next-news fs-4 fw-bold text-decoration-none small">Đọc tiếp →</a>
                        </div>
                    </div>
                </div>`;
        });
        htmlContent += `<div class="carousel-item ${isActive}">${pairHtml}</div>`;
    }
    sliderInner.innerHTML = htmlContent;
}

document.addEventListener("DOMContentLoaded", loadNews);