async function initNewsDetail() {
    try {
        const response = await fetch("../data/news.json");
        const newsData = await response.json();

        // 1. Lấy ID bài viết từ URL (?id=NEW_01)
        const params = new URLSearchParams(window.location.search);
        const newsId = params.get("id");

        // 2. Tìm bài viết tương ứng
        const currentNews = newsData.find(n => n.id === newsId) || newsData[0];

        // 3. Render bài viết chính
        renderMainNews(currentNews);

        // 4. Render danh sách bên trái (trừ bài hiện tại)
        renderSidebar(newsData, newsId);

    } catch (error) {
        console.error("Lỗi:", error);
    }
}

function renderMainNews(news) {
    const detailArea = document.getElementById("newsDetailArea");
    detailArea.innerHTML = `
        <span class="badge heading-pink font-text rounded-pill px-3 mb-3">${news.headding}</span>
        <h1>${news.title}</h1>
        <div class="d-flex align-items-center gap-3 mb-4 text-muted small">
            <span>📅 ${news.published}</span>
            <span>✍️ Admin KidVogue</span>
        </div>
        <img src="${news.image}" class="img-fluid rounded-4 mb-4 w-100 shadow-sm" alt="${news.title}">
        <div class="news-body-text">
            ${news.content}
        </div>
    `;
}

function renderSidebar(allNews, currentId) {
    const sidebar = document.getElementById("sidebarNews");
    let html = "";

    allNews.forEach(news => {
        // Không hiển thị lại bài đang đọc trong sidebar
        if (news.id !== currentId) {
            html += `
                <a href="newsDetail.html?id=${news.id}" class="text-decoration-none text-dark">
                    <div class="small-news-card d-flex gap-3 p-2 mb-3 shadow-sm bg-white">
                        <img src="${news.image}" alt="thumb">
                        <div>
                            <h6 class="fw-bold mb-1 text-truncate-2" style="font-size: 1.2rem;">${news.title}</h6>
                            <small class="text-muted" style="font-size: 0.9rem;">${news.published}</small>
                        </div>
                    </div>
                </a>
            `;
        }
    });

    sidebar.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", initNewsDetail);