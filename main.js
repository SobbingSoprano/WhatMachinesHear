//handles fade in for elements on homepage
document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.remove("hide");
    setTimeout(() => {
        document.querySelector(".searchbar").classList.remove("hide");
    }, 2500);
});


