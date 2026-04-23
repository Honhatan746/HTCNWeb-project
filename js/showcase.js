try {
    fetch("../data/showcase.json")
        .then(response => response.json())
        .then(showcase => {

            const topProduct = showcase.map(product => {
                const allPrices = product.variants.flatMap(v => v.item.map(i => i.price));
                const maxPrice = Math.max(...allPrices);
                return { ...product, topPrice: maxPrice };
            })
                .sort((a, b) => b.topPrice - a.topPrice)
                .slice(0, 8);

            const container = document.getElementById("showcaselist");


            var cart = '';

            topProduct.forEach(product => {
                cart += `
            <a href="../productDetail.html?id=${product.productID}" class="cart product-card">
                   <div class="product-img-container frame_img"> <img src="${product.variants[0].image[0]}" alt="image" class="img-cls"></div>
                <div class="cart_text">
                    <h3>${product.name}</h3>
                    <h3 class="heading-pink fw-bold">${product.variants[0].item[0].price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</h3> 
                    <div class="frame_img cart-color"><img class="img-cls" src="${product.variants[0].image[1]}"></div>       
                </div>
            </a>
        `
            })

            container.innerHTML = cart;
        })
} catch (error) {

}