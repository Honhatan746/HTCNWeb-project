//fetch data for Feature news 
fetch("../data/news.json")
.then(response => response.json())
.then(listNews => {
    const newsContainer = document.getElementById("newlist");

    var cart = '';

    listNews.forEach(news => {
        cart += `
                <a href="" class=" text-deco-none color-black news_cart">
                    <div class="frame_img aspect-16-9"><img src="${news.image}" alt="news" class="img-cls"></div>
                    <div class="news_text">
                        <h1>${news.headding}</h1>
                        <p>${news.excerpt}</p>
                    </div>
                </a>
        `
    })
    newsContainer.innerHTML = cart;
})