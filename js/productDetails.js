//JavaScript Thumbail
function changeImage(img){
    const mainImg = document.getElementById("mainImg");
    const newSrc = img.src;

    if(mainImg.src === newSrc) return;

    mainImg.classList.add("fade-out");

    setTimeout(() => {
        mainImg.src = newSrc;

        mainImg.onload = () =>{
            mainImg.classList.remove("fade-out");
        }
    }, 300);
}
//Quantity
const inputQuan = document.getElementById("quantity");
function subtract(){
    let value = parseInt(inputQuan.value);
    if(value > 1) inputQuan.value = value - 1;
}
function add(){
    let value = parseInt(inputQuan.value);
    inputQuan.value = value + 1;
}