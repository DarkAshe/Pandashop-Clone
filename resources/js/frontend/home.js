async function loadProducts() {
    const query = `{ 
        products { 
            id
            name
            image
            originalPrice
            discountPrice
        } 
    }`
    
    try {
        const data = await fetchGraphQL(query, "GET")
        const products = data.products

        const target = document.getElementById("loadRecentProducts")
        let productsPassed = 0
        for (const product of products) {
            if (productsPassed++ >= 5) break
            const contentToInsert = `
                <div class="product-card">
                    <a href="./singleProduct.html?id=${product.id}">
                        <img src="./img/placeholder.png" alt="productImage">
                        <p class="product-title">${product.name}</p>
                    </a>
                    <span class="price">${product.originalPrice} MDL</span>
                    <div class="btn">Add to Cart</div>
                </div>
            `
            target.insertAdjacentHTML('afterend', contentToInsert)
        }
        
        target.remove();
    } catch (error) {
        console.error("Error loading products:", error)
    }
}

async function loadDiscountedProducts() {
    const query = `{ 
        products(filter: { 
            discountedOnly: true 
        }) { 
            id 
            name 
            image 
            originalPrice 
            discountPrice 
        } 
    }`

    try {
        const data = await fetchGraphQL(query, "GET")
        const products = data.products

        const target = document.getElementById("loadDiscountedProducts")
        let productsPassed = 0
        for (const product of products) {
            if (productsPassed++ >= 5) break
            const contentToInsert = `
                <div class="product-card">
                    <a href="./singleProduct.html?id=${product.id}">
                        <img src="./img/placeholder.png" alt="productImage">
                        <p class="product-title">${product.name}</p>
                    </a>
                    <span class="price"><s>${product.originalPrice}</s> ${product.discountPrice} MDL</span>
                    <div class="btn">Add to Cart</div>
                </div>
            `
            target.insertAdjacentHTML('afterend', contentToInsert)
        }

        target.remove()
    } catch (error) {
        console.error("Error loading discounted products:", error)
    }
}


async function loadCategories() {
    const query = `{ 
        categories { 
            id 
            name 
            image 
        } 
    }`

    try {
        const data = await fetchGraphQL(query, "GET")
        const categories = data.categories

        const target = document.getElementById("loadCategories")
        categories.forEach(category => {
            const contentToInsert = `
                <div class="category-card" style="background-image: url('./img/placeholder.png'); background-size:cover; background-position: center;">
                    <a href="./productGalery.html?categoryId=${category.id}">
                        <p class="category-title">${category.name}</p>
                    </a>
                </div>
            `;  
            target.insertAdjacentHTML('afterend', contentToInsert)
        })

        target.remove()
    } catch (error) {
        console.error("Error loading categories:", error)
    }
}

loadProducts()
loadDiscountedProducts()
loadCategories()