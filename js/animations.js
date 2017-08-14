function changeAnimation(newClass) {
    var mainAnim = document.getElementById('main-animation');
    mainAnim.className = "";
    mainAnim.classList.add(newClass);
}

function changeIllustration(imgSrc) {
    var mainAnim = document.getElementById('main-illustration');
    mainAnim.src = imgSrc;
}
