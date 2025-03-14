async function registerUser() {
    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirmPassword").value

    if (password !== confirmPassword) {
        showNotification("Passwords do not match.", "error")
        return
    }

    const query = `mutation {
        register(username: "${username}", email: "${email}", password: "${password}") {
            user { id username email }
        }
    }`

    try {
        await fetchGraphQL(query, "POST")
        showNotification("Registration successful! Redirecting to login...", "success")
        window.location.href = "login.html"
    } catch (error) {
        showNotification("Error registering user.", "error")
        console.error(error)
    }
}

async function loginUser() {
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    const query = `mutation {
        login(email: "${email}", password: "${password}") {
            user { id username email }
        }
    }`

    try {
        await fetchGraphQL(query, "POST")
        showNotification("Login successful! Redirecting...", "success")
        window.location.href = "index.html"
    } catch (error) {
        showNotification("Invalid credentials.", "error")
        console.error(error)
    }
}

function logoutUser() {
    document.cookie = "authToken= expires=Thu, 01 Jan 1970 00:00:00 UTC path=/"
    showNotification("Logged out successfully.", "success")
    window.location.href = "login.html"
}

function checkAuthStatus() {
    const authToken = document.cookie.split(" ").find(row => row.startsWith("authToken="))
    return authToken ? true : false
}



async function getCurrentUser() {
    const query = `{
        currentUser {
            id
            username
            email
        }
    }`

    try {
        const response = await fetchGraphQL(query)
        console.log(response)
        if (response.currentUser) { 
            console.log("Current User:", response.currentUser)
        } else {
            console.log("No user is logged in.")
        }
    } catch (error) {
        console.error("Error fetching current user:", error)
    }
}
