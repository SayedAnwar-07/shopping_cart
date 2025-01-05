let cart = [];

// Function to add an item to the cart
const addToCart = (productId) => {
  // Simulate fetching product details based on productId
  fetch("./products.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
      if (product) {
        const existingItem = cart.find((item) => item.id === productId);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({ ...product, quantity: 1 });
        }
        updateCartCount();
        renderCart();
      }
    })
    .catch((error) => console.error("Error fetching product details:", error));
};

// Function to update cart count in the header
const updateCartCount = () => {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector(".badge").textContent = cartCount;
};

// Function to render the cart section
const renderCart = () => {
  const cartSection = document.querySelector("#cartSectionRender");
  const modalCartSection = document.querySelector("#modal-cart-section");

  cartSection.innerHTML = `
    <h1 class="text-lg font-bold mb-4">Cart</h1>
    ${
      cart.length === 0
        ? `<p>Your cart is empty.</p>`
        : cart
            .map(
              (item) => `
      <div class="flex items-center mb-4">
        <div
        class="w-20 h-20 mr-4 p-2 flex justify-center items-center bg-gray-100"
      >
        <img
          src="${item.image}"
          alt="${item.name}"
          class="w-full h-full object-contain rounded-sm"
        />
      </div>
        <div class="flex-1">
          <h3 class="font-medium">${item.name}</h3>
          <p class="text-sm text-gray-600">Price: $${item.price}</p>
          <div class="flex items-center mt-2">
            <button class="px-2 py-1 bg-gray-200 rounded" onclick="updateQuantity(${
              item.id
            }, -1)">-</button>
            <span class="px-4">${item.quantity}</span>
            <button class="px-2 py-1 bg-gray-200 rounded" onclick="updateQuantity(${
              item.id
            }, 1)">+</button>
          </div>
        </div>
        <p class="font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
      </div>
    `
            )
            .join("") +
          `
    <hr class="my-4">
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Total:</h3>
      <p class="font-bold">$${calculateTotal().toFixed(2)}</p>
    </div>
    <button class="bg-black text-white px-6 py-2 rounded-sm block w-full mt-4 hover:bg-gray-800" onclick="clearCart()">Clear Cart</button>
    `
    }
  `;

  // Update modal content
  updateModalCart();
};

// New function to update the modal's cart items dynamically
const updateModalCart = () => {
  const modalCartSection = document.querySelector("#modal-cart-section");

  if (cart.length === 0) {
    modalCartSection.innerHTML = `
      <p class="text-center text-gray-500">Your cart is empty.</p>
    `;
    return;
  }

  const totalCost = cart
    .reduce((acc, item) => acc + item.price * item.quantity, 0)
    .toFixed(2);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  modalCartSection.innerHTML = `
    <div class="space-y-4">
      ${cart
        .map(
          (item) => `
        <div class="flex justify-between items-center gap-20">
          <div class="flex items-center">
            <img class="w-16 h-16 mr-4 rounded" src="${item.image}" alt="${
            item.name
          }" />
            <div>
              <h3 class="font-medium">${item.name}</h3>
              <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
            </div>
          </div>
          <p class="font-bold">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      `
        )
        .join("")}
    </div>
    <hr class="my-4">
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Total Items:</h3>
      <p class="font-bold">${totalItems}</p>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Total Cost:</h3>
      <p class="font-bold">$${totalCost}</p>
    </div>
  `;
};

// Function to update the quantity of a cart item
const updateQuantity = (productId, change) => {
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) {
      cart = cart.filter((item) => item.id !== productId);
    }
    updateCartCount();
    renderCart();
  }
};

// Function to clear the cart
const clearCart = () => {
  cart = [];
  updateCartCount();
  renderCart();
};

// Function to calculate the total price of items in the cart
const calculateTotal = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Initial rendering of the cart
renderCart();
