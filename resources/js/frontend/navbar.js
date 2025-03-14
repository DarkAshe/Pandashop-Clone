async function loadNavbar() {
    const query = `{ categories { id name } }`;

    try {
        const data = await fetchGraphQL(query, "GET");
        const categories = data.categories;
 
        const target = document.getElementById("loadNavbar");
        const contentToInsert = `
            <nav>
                <div class="navbar">
                    <div class="hamburger" id="hamburger">&#9776;</div>
                    <a href="index.html">
                        <img src="./img/logo_default.png" class="logo-default" alt="Panda Shop Logo">
                        <img src="./img/logo_mobile.png" class="logo-mobile" alt="Panda Shop Logo">
                    </a>

                    <div class="icons">
                        <a href="login.html"><i class="fas fa-user"></i></a>
                        <i class="fas fa-shopping-cart hamburger-cart" id="hamburger-cart"></i>
                    </div>
                </div>
                <div class="sidebar" id="sidebar"></div>
                <div class="sidecart" id="sidecart"></div>
            </nav>
        `;
        target.insertAdjacentHTML('afterend', contentToInsert);

        const sidebar = document.getElementById("sidebar");
        const hamburger = document.getElementById("hamburger");

        const sidecart = document.getElementById("sidecart");
        const hamburgerCart = document.getElementById("hamburger-cart");

        hamburger.addEventListener("click", function () {
            sidebar.classList.toggle("show");
        });

        hamburgerCart.addEventListener("click", function () {
            sidecart.classList.toggle("show");
        });

        categories.forEach(category => {
            const categoryLink = `<div class="sidebarElement" onclick="redirectToProductGalery(${category.id})">${category.name}</div>`;
            sidebar.insertAdjacentHTML('afterbegin', categoryLink);
        });
        target.remove()
    } catch (error) {
        console.error("Error loading navigation bar:", error);
    }
}

async function redirectToProductGalery(categoryId) {
    window.location.href = `productGalery.html?categoryId=${categoryId}`;
}

loadNavbar();