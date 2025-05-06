function loadMenuInteractions() {
    const currentPage = document.location.pathname.split("/").pop();

    const menuLinks = document.querySelectorAll("nav ul li a");

    menuLinks.forEach((link) => {

        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }

        link.addEventListener("mouseenter", () => {
            link.style.color = "#FFD700";
        });

        link.addEventListener("mouseleave", () => {
            link.style.color = "#998C42";
        });
    });
}


document.addEventListener("DOMContentLoaded", () => {
    loadMenuInteractions();
});
