function loadAdminNavbar() {
    try {
        const navElement = document.querySelector("nav")
        if (navElement) {
            const contentToInsert = `
                <div class="top-bar">
                    <div class="top-bar-left">
                        <div class="hamburger" id="hamburger">&#9776;</div>
                        <h1><a href="http://localhost:3000">PandaShop</a></h1>
                    </div>
                    <div class="user-menu">
                        <span>Admin</span>
                    </div>
                </div>
                <div class="sidebar" id="sidebar">
                    <ul class="menu">
                        <li class="dropdown">
                            <div class="dropdown-btn">Categories</div>
                            <ul class="dropdown-content">
                                <li><a href="./categories/viewCategories.html">View Categories</a></li>
                                <li><a href="./categories/addCategories.html">Add Categories</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <div class="dropdown-btn">Products</div>
                            <ul class="dropdown-content">
                                <li><a href="./products/viewProducts.html">View Products</a></li>
                                <li><a href="./products/addProducts.html">Add Products</a></li>
                            </ul>
                        </li>
                        <div class="dropdown-btn"><a href="./viewUsers.html">Users</a></div>
                    </ul>
                </div>
            `
            navElement.insertAdjacentHTML('afterend', contentToInsert)

            const dropdownButtons = document.querySelectorAll(".dropdown-btn")
            const sidebar = document.getElementById("sidebar")
            const hamburger = document.getElementById("hamburger")
            dropdownButtons.forEach(button => {
                button.addEventListener("click", function () {
                    const dropdownContent = this.nextElementSibling
                    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block"
                })
            })

            hamburger.addEventListener("click", function () {
                sidebar.classList.toggle("show");
            });
        } else {
            console.error("Nav element not found!")
        }
    } catch (error) {
        console.error("Error loading navigation bar:", error)
    }
}

loadAdminNavbar()