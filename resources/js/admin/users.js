async function loadUsers() {
    const query = `{ users { id username email } }`

    try {
        const data = await fetchGraphQL(query, "GET")
        const users = data.users
        const tableBody = document.querySelector("#usersTable tbody")
        tableBody.innerHTML = ""
        users.forEach(user => {
            const row = document.createElement("tr")
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td style="display: flex gap: 1rem">
                    <div class="btn action-btn" onclick="editProduct(${user.id})">Edit</div>
                    <div class="btn action-btn" onclick="deleteProduct(${user.id})">Delete</div>
                </td>
            `
            tableBody.appendChild(row)
        })
        
    } catch (error) {
        console.error("Error loading products:", error)
    }
}
