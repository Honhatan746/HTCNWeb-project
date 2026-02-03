// Fetch data for showcase products 
fetch("../data/showcase.json")
.then(response => response.json())
.then(showcase => {

    const container = document.getElementById("showcaselist");


    var cart = '';
    
    showcase.forEach(product => {
        cart += `
            <div class="cart">
                   <div class="frame_img"> <img src="${product.image}" alt="image"></div>
                <div class="cart_text">
                    <h3>${product.name}</h3>
                    <h3 class="cart_price">${product.price.toLocaleString("vi-VN",{style: "currency",currency: "VND"})}</h3>    
                </div>
            </div>
        `
    })
    
    container.innerHTML = cart;

})
// Fetch data for girlfashion 
fetch("../data/showcase.json")
.then(response => response.json())
.then(girlProducts => {
    
    const girlContainer = document.getElementById("girlfashlist");

    var cart ='';
    
    girlProducts.forEach(girlProduct => {
        cart +=`
            <div class="cart swiper-slide mr-10-30 max-width-cart-swiper">
                <div class="frame_img"> <img src="${girlProduct.image}" alt="image"></div>
                <div class="cart_text">
                    <h3>${girlProduct.name}</h3>
                    <h3 class="cart_price">${girlProduct.price.toLocaleString("vi-VN",{style: "currency",currency: "VND"})}</h3>    
                </div>
            </div>  
        ` 
    })
    girlContainer.innerHTML = cart;


})
// Fetch data for boy fashion
fetch("../data/showcase.json")
.then(response => response.json())
.then(boyProducts => {
    
    const boyContainer = document.getElementById("boyfashlist");

    var cart ='';
    
    boyProducts.forEach(boyProduct => {
        cart +=`
            <div class="cart swiper-slide mr-10-30 max-width-cart-swiper ">
               <div class="frame_img"> <img src="${boyProduct.image}" alt="image"></div>
                <div class="cart_text">
                    <h3>${boyProduct.name}</h3>
                    <h3 class="cart_price">${boyProduct.price.toLocaleString("vi-VN",{style: "currency",currency: "VND"})}</h3>    
                </div>
            </div>  
        ` 
    })
    boyContainer.innerHTML = cart;


})

//Fetch data for accessories fashion
fetch("../data/showcase.json")
.then(response => response.json())
.then(accessProducts => {
    
    const accessContainer = document.getElementById("accessfashlist");

    var cart ='';
    
    accessProducts.forEach(accessProduct => {
        cart +=`
            <div class="cart swiper-slide mr-10-30 max-width-cart-swiper ">
                <div class="frame_img"> <img src="${accessProduct.image}" alt="image"></div>
                <div class="cart_text">
                    <h3>${accessProduct.name}</h3>
                    <h3 class="cart_price">${accessProduct.price.toLocaleString("vi-VN",{style: "currency",currency: "VND"})}</h3>    
                </div>
            </div>  
        ` 
    })
    accessContainer.innerHTML = cart;


})
//fetch data for Feature news 
fetch("../data/news.json")
.then(response => response.json())
.then(listNews => {
    const newsContainer = document.getElementById("newlist");

    var cart = '';

    listNews.forEach(news => {
        cart += `
                <div class="news_cart">
                    <div class="frame_img aspect-16-9"><img src="${news.image}" alt="news"></div>
                    <div class="news_text">
                        <h1>${news.headding}</h1>
                        <p>${news.excerpt}</p>
                    </div>
                </div>
        `
    })
    newsContainer.innerHTML = cart;
})
// Swiper
    const swipers = document.querySelectorAll('.swiper'); //return a lot of elements : NodeList

    swipers.forEach(swiper => {
        const wraper = swiper.querySelector('.swiper-wrapper');
        const btnPre = swiper.querySelector('.swiper-button-prev');
        const btnNext = swiper.querySelector('.swiper-button-next');

        btnPre.addEventListener('click', ()=>{
            wraper.scrollLeft -= 300;
        });
        btnNext.addEventListener('click', ()=>{
            wraper.scrollLeft += 300;
        });
    }); 
// End Swiper
// Search
const btnsSearch = document.querySelectorAll('.js-search-icon');
const searchModal = document.querySelector('.js_search');
const searchContent = document.querySelector('.js-search_body');

function showModal(){
    
    searchModal.classList.add('open');
    searchContent.classList.add('open');
}
function hideModal() {
    searchModal.classList.remove('open');
    searchContent.classList.remove('open');
  }

btnsSearch.forEach(btnSearch => {
    btnSearch.addEventListener('click', (event)=>{
        event.stopPropagation();
        showModal();
    })
});
searchModal.addEventListener('click', hideModal);

searchContent.addEventListener('click', (event)=>{ // ngăn chặn sự kiện nổi bọt, vì khi nhấn vào các phần tử con thì phần search cũng đóng lại nên phải ngăn chặn nó
    event.stopPropagation();
})
window.addEventListener('scroll', hideModal);
// End Search
// Menu 
const btnsMenuMobile = document.querySelectorAll('.menu-ti-js');
const menuMobile = document.querySelector('.menu-mobile-js');
const menuMobileBody = document.querySelector('.menu-mobile_body');

function showMenuMobile(){
    menuMobile.classList.add('open');
    menuMobileBody.classList.add('open');
}
function hideMenuMobile(){
    menuMobile.classList.remove('open');
    menuMobileBody.classList.remove('open');
}

btnsMenuMobile.forEach(btnMenuMobile => {
    btnMenuMobile.addEventListener('click', showMenuMobile)
});
menuMobile.addEventListener('click', hideMenuMobile);
menuMobileBody.addEventListener('click', (event)=>{
    event.stopPropagation();
});
// End Menu