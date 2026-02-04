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