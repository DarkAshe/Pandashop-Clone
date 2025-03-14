async function updateUserTitle() {
    const query = `{
        currentUser {
            id
            username
            email
        }
    }`;

    try {
        const response = await fetchGraphQL(query);

        if (response.currentUser) { 
            const userUsername = document.getElementById("user-username");
            userUsername.innerText = response.currentUser.username;
        }
    } catch (error) {
        console.error("Error fetching current user:", error);
    }
}
