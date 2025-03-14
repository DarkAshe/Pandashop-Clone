async function fetchGraphQL(query, method = "POST") {
    try {
        if (method.toUpperCase() === "GET") {
            const url = `http://localhost:3000/graphql?query=${encodeURIComponent(query)}`;
            const response = await axios.get(url);
            return response.data.data;
        } else {
            const response = await axios.post("http://localhost:3000/graphql", { query });
            return response.data.data;
        }
    } catch (error) {
        console.error(`GraphQL ${method.toUpperCase()} Error:`, error.response ? error.response.data : error);
        throw error;
    }
}

function showNotification(message, type) {
    const notification = document.getElementById("notification");
    notification.innerText = message;
    notification.className = `notification ${type}`;
    notification.style.display = "block";

    setTimeout(() => {
        notification.style.display = "none";
    }, 3000);
}

async function loadUsers() {
    const query = `{ users { id username email } }`;

    try {
        const data = await fetchGraphQL(query, "GET");
        const users = data.users;
        const tableBody = document.querySelector("#usersTable tbody");
        tableBody.innerHTML = "";
        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td style="display: flex; gap: 1rem;">
                    <div class="btn action-btn" onclick="editProduct(${user.id})">Edit</div>
                    <div class="btn action-btn" onclick="deleteProduct(${user.id})">Delete</div>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
    } catch (error) {
        console.error("Error loading products:", error);
    }
}
