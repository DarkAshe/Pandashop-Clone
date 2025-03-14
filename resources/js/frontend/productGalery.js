async function updateCategoryTitle(){
    const categoryId = new URL(window.location.href).searchParams.get("categoryId");
    
    const query = `{ category(id: ${categoryId}) { name } }`;
    try {
        const data = await fetchGraphQL(query, "GET");
        const category = data.category;

        document.getElementById("categoryTitle").innerText = "Browing in " + category.name;
        document.getElementById("categoryImage").value = category.image;
    } catch (error) {
        console.error("Error fetching category:", error);
    }
}

async function loadProductsByCategory() {
    const categoryId = new URL(window.location.href).searchParams.get("categoryId");

    if (!categoryId) {
        console.error("Category ID not found in the URL.");
        return;
    }

    const query = `{
        products(filter: { categoryId: ${categoryId} }) { 
            id 
            name 
            image 
            originalPrice 
            discountPrice 
        } 
    }`;

    try {
        const scriptTag = document.currentScript;

        const data = await fetchGraphQL(query, "GET");
        const products = data.products;

        if (!products.length) {
            console.warn("No products found for this category.");
            return;
        }

        for (const product of products) {
            const contentToInsert = `
                <div class="product-card">
                    <a href="./singleProduct.html?id=${product.id}">
                    <img src="${'./img/placeholder.png'}" alt="product image">
                    <p class="product-title">${product.name}</p>
                    </a>
                    <span class="price">${product.originalPrice} MDL</span>
                    <div class="btn">Add to Cart</div>
                </div>
            `;
            scriptTag.insertAdjacentHTML('afterend', contentToInsert);
        }
        
    } catch (error) {
        console.error("Error loading products:", error);
    }
}
