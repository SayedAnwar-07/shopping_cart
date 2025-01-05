const fetchProducts = async () => {
  try {
    const response = await fetch("./products.json");
    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

const renderProducts = (products) => {
  const productList = document.getElementById("product-list");
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "p-4 bg-white shadow-md rounded-sm"; // Tailwind classes for styling
    productCard.innerHTML = `
      <div class="flex justify-center items-center mt-6">
        <img
          class="h-72 rounded-sm"
          src="${product.image}"
          alt="${product.name}"
        />
      </div>
      <div class="mt-6 px-2">
        <p class="text-lg font-medium text-gray-800">$${product.price}</p>
        <h3 class="font-bold text-2xl text-black mt-2">${product.name}</h3>
        <p class="text-gray-600 mt-2">${product.description}</p>
        <div class="mt-6 p-6">
          <button
            class="bg-black text-white border border-black px-6 py-2 rounded-full hover:bg-white hover:text-black transition block w-full"
            onclick="addToCart(${product.id})"
          >
            Add To Cart
          </button>
        </div>
      </div>
    `;
    productList.appendChild(productCard);
  });
};

fetchProducts();
