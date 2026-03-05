// Fetch data for girlfashion 
fetch("./data/girlFashion.json")
.then(response => response.json())
.then(girlProducts => {
    
    const girlContainer = document.getElementById("girlfashlist");

    var cart ='';
    
    girlProducts.forEach(girlProduct => {
        cart +=`
            <a href="../productDetail.html?id=${girlProduct.productID}" class="cart swiper-slide mr-10-30 max-width-cart-swiper">
                <div class="frame_img"> <img src="${girlProduct.variants[0].image[0]}" alt="image" class="img-cls"></div>
                <div class="cart_text">
                    <h3>${girlProduct.name}</h3>
                    <h3 class="heading-pink">${girlProduct.variants[0].item[0].price.toLocaleString("vi-VN",{style: "currency",currency: "VND"})}</h3>    
                    <div class="frame_img cart-color"><img class="img-cls" src="${girlProduct.variants[0].image[1]}"></div>       
                    </div>
            </a>  
        ` 
    })
    girlContainer.innerHTML = cart;


})