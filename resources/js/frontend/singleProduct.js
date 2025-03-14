async function loadProduct() {
    const id = new URL(window.location.href).searchParams.get("id")
    const query = `{ product(id: ${id}) { id name image originalPrice discountPrice category { name } attributes { key value } } }`

    try {
        const data = await fetchGraphQL(query, "GET")
        const product = data.product

        const target = document.getElementById("loadSingleProduct")
        const contentToInsert = `
            <h1>${product.name}</h1>
            <div style="display: flex;flex-wrap: wrap;align-items: flex-start;">
                <div class="left">
                    <img src="./img/placeholder.png" alt="productImage" style="max-width: 50%;">
                    <div id="specsInfo">
                        <h2 class="specsHeading">Specifications</h2>
                        <div id="specsContainer"></div>
                    </div>
                </div>
                <div class="right">
                    <div class="price-box">
                        <p class="price">${product.originalPrice} MDL</p>
                        <a href="#" class="btn">Buy</a>
                    </div>
                </div>
            </div>
        `


        target.insertAdjacentHTML('afterend', contentToInsert)

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

        target.remove()
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

async function moveSpecsToRightRegion() {
    const specsInfo = document.getElementById("specsInfo")
    const leftRegion = document.querySelector(".left")
    const rightRegion = document.querySelector(".right")

    if (window.innerWidth <= 768) {
        rightRegion.appendChild(specsInfo);
    } else {
        leftRegion.appendChild(specsInfo);
    }
}

loadProduct()
window.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => moveSpecsToRightRegion(), 100)
})
window.addEventListener("resize", moveSpecsToRightRegion)