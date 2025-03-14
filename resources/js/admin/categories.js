async function createCategory() {
    const name = document.getElementById("categoryName").value.trim()
    const image = document.getElementById("categoryImage").value.trim()

    if (!name || !image) {
        showNotification("All fields are required!", "error")
        return
    }

    const query = `mutation { createCategory(name: "${name}", image: "${image}") { id, name, image } }`

    try {
        await fetchGraphQL(query)
        showNotification("Category created successfully!", "success")
    } catch (error) {
        showNotification("Error creating category!", "error")
    }
}

async function deleteCategory(id) {
    const query = `mutation { deleteCategory(id: ${id}) { id } }`
    try {
        await fetchGraphQL(query)
        showNotification("Category deleted successfully!", "success")
        loadCategories()
    } catch (error) {
        showNotification("Error deleting category!", "error")
    }
}

async function getCategoryDetails() {
    const id = new URL(window.location.href).searchParams.get("id")
    const query = `{ category(id: ${id}) { id name image } }`
    try {
        const data = await fetchGraphQL(query, "GET")
        const category = data.category

        document.getElementById("categoryName").value = category.name
        document.getElementById("categoryImage").value = category.image
    } catch (error) {
        console.error("Error fetching category:", error)
    }
}

function editCategory(id) {
    window.location.href = `categories/editCategories.html?id=${id}`
}

async function updateCategory() {
    const id = new URL(window.location.href).searchParams.get("id")

    const name = document.getElementById("categoryName").value
    const image = document.getElementById("categoryImage").value

    const query = `mutation { updateCategory(id: ${id}, name: "${name}", image: "${image}") { id name image } }`
    try {
        await fetchGraphQL(query)
        showNotification("Category updated successfully!", "success")
        setTimeout(() => {
            window.location.href = "categories/viewCategories.html"
        }, 3000)
    } catch (error) {
        showNotification("Error updating category!", "error")
    }
}

async function loadCategories() {
    const query = `{ categories { id name image } }`

    try {
        const data = await fetchGraphQL(query, "GET")
        const categories = data.categories

        const tableBody = document.querySelector("#categoriesTable tbody")
        if(tableBody) {
            tableBody.innerHTML = ""

            categories.forEach(category => {
                const row = document.createElement("tr")
                row.innerHTML = `
                            <td>${category.id}</td>
                            <td>${category.name}</td>
                            <td><img src="../img/placeholder.png" alt="${category.name}" style="width: 50px height: 50px"></td>
                            <td style="display: flex gap: 1rem">
                                <div class="btn action-btn" onclick="editCategory(${category.id})">Edit</div>
                                <div class="btn action-btn" onclick="deleteCategory(${category.id})">Delete</div>
                            </td>
                        `
                tableBody.appendChild(row)
            })
        } else {
            console.error("#categoriesTable tbody not found!")
        }

    } catch (error) {
        console.error("Error loading categories:", error)
    }
}

if (window.location.href.includes("viewCategories.html")) {
    loadCategories()
}

if (window.location.href.includes("editCategories.html")) {
    getCategoryDetails()
}
