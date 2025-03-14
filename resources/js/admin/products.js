async function loadProducts() {
    const query = `{ products { id name image originalPrice discountPrice category { name } } }`

    try {
        const data = await fetchGraphQL(query, "GET")

        if (!data || !data.products || !Array.isArray(data.products)) {
            console.error("Invalid data format received from GraphQL:", data)
            showNotification("Failed to load products!", "error")
            return
        }

        const products = data.products
        
        const tableBody = document.querySelector("#productsTable tbody")
        tableBody.innerHTML = ""
        products.forEach(product => {
            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td><img src="../img/placeholder.png" alt="${product.name}" style="width: 50px height: 50px"></td>
                <td>${product.originalPrice}</td>
                <td>${product.discountPrice}</td>
                <td>${product.category?.name || "N/A"}</td>
                <td style="display: flex gap: 1rem">
                    <div class="btn action-btn" onclick="editProduct(${product.id})">Edit</div>
                    <div class="btn action-btn" onclick="deleteProduct(${product.id})">Delete</div>
                </td>
            `
            tableBody.appendChild(row)
        })
        
    } catch (error) {
        console.error("Error loading products:", error)
    }
}

async function createProduct() {
    const name = document.getElementById("productName").value.trim()
    const image = document.getElementById("productImage").value.trim()
    const originalPrice = parseFloat(document.getElementById("originalPrice").value)
    const discountPrice = parseFloat(document.getElementById("discountPrice").value)
    const categoryId = document.getElementById("category").value

    if (!name || !image || !originalPrice || !discountPrice || !categoryId) {
        showNotification("All fields are required!", "error")
        return
    }

    const attributes = []
    document.querySelectorAll(".attribute-box").forEach(div => {
        const key = div.querySelector(".attr-key").value.trim()
        const value = div.querySelector(".attr-value").value.trim()
        if (key && value) {
            attributes.push({ key, value })
        }
    })

    const query = `
    mutation {
        createProduct(
            name: "${name}",
            image: "${image}",
            originalPrice: ${originalPrice},
            discountPrice: ${discountPrice},
            categoryId: ${categoryId},
            attributes: [${attributes.map(attr => `{ key: "${attr.key}", value: "${attr.value}" }`).join(",")}]
        ) {
            id, name, originalPrice, discountPrice, image, category { name }, attributes { key, value }
        }
    }`

    try {
        const response = await axios.post("http://localhost:3000/graphql", { query })

        if (response.data.data.createProduct) {
            showNotification("Product created successfully!", "success")
        }
    } catch (error) {
        showNotification("Error Creating Product!", "error")
        console.error("Error:", error.response ? error.response.data : error)
    }
}

async function loadCategories() {
    const query = `{
        categories {
            id
            name
        }
    }`

    try {
        const response = await axios.post("http://localhost:3000/graphql", { query })
        const categories = response.data.data.categories

        const categorySelect = document.getElementById("category")
        categorySelect.innerHTML = `<option value="">Select a category</option>`

        categories.forEach(category => {
            categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`
        })

    } catch (error) {
        console.error("Error loading categories:", error)
    }
}   

function addAttribute() {
    const container = document.getElementById("attributes-container")
    const attributeDiv = document.createElement("div")
    attributeDiv.classList.add("attribute-box")

    attributeDiv.innerHTML = `
        <input type="text" placeholder="Attribute Name" class="attr-key">
        <input type="text" placeholder="Attribute Value" class="attr-value">
        <div class="btn remove-btn" onclick="this.parentElement.remove()">Delete</div>
    `

    container.appendChild(attributeDiv)
}

async function editProduct(id) {
    window.location.href = `products/editProducts.html?id=${id}`
}

async function getProductDetails() {
    const id = new URL(window.location.href).searchParams.get("id")
    const query = `{ product(id: ${id}) { name image originalPrice discountPrice category { id } attributes { key value } } }`
    try {
        const data = await fetchGraphQL(query, "GET")
        const product = data.product

        document.getElementById("productName").value = product.name
        document.getElementById("productImage").value = product.image
        document.getElementById("originalPrice").value = product.originalPrice
        document.getElementById("discountPrice").value = product.discountPrice
        document.getElementById("category").value = product.category.id

        const attributesContainer = document.getElementById("attributes-container")

        product.attributes.forEach(attr => {
            const attributeDiv = document.createElement("div")
            attributeDiv.classList.add("attribute-box")
        
            attributeDiv.innerHTML = `
                <input type="text" placeholder="Attribute Name" class="attr-key" value="${attr.key}">
                <input type="text" placeholder="Attribute Value" class="attr-value" value="${attr.value}">
                <div class="btn remove-btn" onclick="this.parentElement.remove()">Delete</div>
            `

            attributesContainer.appendChild(attributeDiv)
        })

    } catch (error) {
        console.error("Error fetching product:", error)
    }
}

async function updateProduct() {
    const id = new URL(window.location.href).searchParams.get("id")

    const name = document.getElementById("productName").value
    const image = document.getElementById("productImage").value
    const originalPrice = parseFloat(document.getElementById("originalPrice").value)
    const discountPrice = parseFloat(document.getElementById("discountPrice").value)
    const categoryId = document.getElementById("category").value

    const attributes = []
    document.querySelectorAll(".attribute-box").forEach(div => {
        const key = div.querySelector(".attr-key").value.trim()
        const value = div.querySelector(".attr-value").value.trim()
        if (key && value) {
            attributes.push({ key, value })
        }
    })

    const query = `
    mutation {
        updateProduct(
            id: ${id},
            name: "${name}",
            image: "${image}",
            originalPrice: ${originalPrice},
            discountPrice: ${discountPrice},
            categoryId: ${categoryId},
            attributes: [${attributes.map(attr => `{ key: "${attr.key}", value: "${attr.value}" }`).join(",")}]
        ) {
            id, name, originalPrice, discountPrice, image, category { name }, attributes { key, value }
        }
    }`

    try {
        await fetchGraphQL(query)
        showNotification("Product updated successfully!", "success")
        setTimeout(() => {
            window.location.href = "products/viewProducts.html"
        }, 3000)
    } catch (error) {
        showNotification("Error updating product!", "error")
    }
}

async function deleteProduct(id) {
    const query = `mutation { deleteProduct(id: ${id}) { id } }`
    try {
        await fetchGraphQL(query)
        showNotification("Product deleted successfully!", "success")
        loadProducts()
    } catch (error) {
        showNotification("Error deleting product!", "error")
    }
}

if (window.location.href.includes("viewProducts.html")) {
    loadProducts()
}

if (window.location.href.includes("editProducts.html")) {
    getProductDetails()
    loadCategories()
}