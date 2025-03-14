async function loadProduct() {
    const id = new URL(window.location.href).searchParams.get("id")
    const query = `{ product(id: ${id}) { name image originalPrice discountPrice attributes { key value } } }`

    try {
        const data = await fetchGraphQL(query, "GET")
        const product = data.product

        document.getElementById("productName").innerHTML = product.name
        document.getElementById("produtPrice").innerHTML = product.originalPrice + " MDL"

        product.attributes.forEach((attr, index) => {
            const specItem = document.createElement("div")
            specItem.classList.add("spec-item")
            specItem.innerHTML = `<span class="spec-key">${attr.key}:</span> <span class="spec-value">${attr.value}</span>`

            if (index % 2 === 0) {
                specItem.classList.add("row-even")
            } else {
                specItem.classList.add("row-odd")
            }

            specsContainer.appendChild(specItem)
        })
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

async function moveSpecsToRightRegion() {
    const productSpecifications = document.getElementById("productSpecifications")
    const leftRegion = document.querySelector(".left")
    const rightRegion = document.querySelector(".right")

    if (window.innerWidth <= 768) {
        rightRegion.appendChild(productSpecifications);
    } else {
        leftRegion.appendChild(productSpecifications);
    }
}

loadProduct()
moveSpecsToRightRegion()
window.addEventListener("resize", moveSpecsToRightRegion)