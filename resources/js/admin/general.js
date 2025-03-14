async function fetchGraphQL(query, method = "POST") {
    try {
        if (method.toUpperCase() === "GET") {
            const url = `http://localhost:3000/graphql?query=${encodeURIComponent(query)}`
            const response = await axios.get(url)
            return response.data.data
        } else {
            const response = await axios.post("http://localhost:3000/graphql", { query })
            return response.data.data
        }
    } catch (error) {
        console.error(`GraphQL ${method.toUpperCase()} Error:`, error.response ? error.response.data : error)
        throw error
    }
}

function showNotification(message, type) {
    const notification = document.getElementById("notification")
    notification.innerText = message
    notification.className = `notification ${type}`
    notification.style.display = "block"

    setTimeout(() => {
        notification.style.display = "none"
    }, 3000)
}