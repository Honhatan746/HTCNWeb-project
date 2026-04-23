function setupSearchEvent() {
    const btnsSearch = document.querySelectorAll('.js-search-icon');
    const searchModal = document.querySelector('.js_search');
    const searchContent = document.querySelector('.js-search_body');

    function showModal(){
        searchModal.classList.add('open');
        searchContent.classList.add('open');
    }

    function hideModal(){
        searchModal.classList.remove('open');
        searchContent.classList.remove('open');
    }

    btnsSearch.forEach(btnSearch => {
        btnSearch.addEventListener('click', (event)=>{
            event.stopPropagation();
            showModal();
        });
    });

    searchModal.addEventListener('click', hideModal);

    searchContent.addEventListener('click', (event)=>{
        event.stopPropagation();
    });

    window.addEventListener('scroll', hideModal);
}
// End Search
function showMenu(){
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
}
document.addEventListener("DOMContentLoaded", () => {
    showMenu(),
    setupSearchEvent();
});
// Hàm tìm kiếm sản phẩm

let timer = null;
const serachInput = document.getElementById("serach_input");
const listProductSearch = document.getElementById("listProductSearch");
serachInput.addEventListener("input", (e) => {
    const keyWord = e.target.value.trim();
    clearTimeout(timer);

    if (keyWord.length === 0) {
        listProductSearch.classList.remove("open");
        setTimeout(() => { listProductSearch.innerHTML = ""; }, 300); // Đợi mờ hết rồi mới xóa chữ
        return;
    }   

    timer = setTimeout(() => {
        searchProduct(keyWord);
    }, 500);
});

async function searchProduct(keyword) {
    const res = await fetch("../data/Product.json");
    const products = await res.json();
    const result = products.filter(product =>
        product.name.toLowerCase().includes(keyword.toLowerCase())
    );

    renderProductSearch(result);
    listProductSearch.classList.add("open");
}

function renderProductSearch(products){
    let cart = "";
    console.log(products);
    if(products.length === 0){
        listProductSearch.innerHTML = `<p>Không có sản phẩm nào hết á</p>`;
        return;
    }
    products.forEach(p => {
            cart += `
                <div class="ItemsSearch di-flex">
                                <a href="productDetail.html?id=${p.productID}" class="frame_img imgSearch"><img class="img-cls" src="${p.variants[0].image[0]}" alt=""></a>
                                <div class="itemSearchContent">
                                    <a href="productDetail.html?id=${p.productID}">${p.name}</a>
                                    <p class="heading-pink">${Number(p.variants[0].item[0].price).toLocaleString("vi-VN") + " đ"}</p>
                                </div>
                </div>
            `;
    });
    listProductSearch.innerHTML = cart;
}