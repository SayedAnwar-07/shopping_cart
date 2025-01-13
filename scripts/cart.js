let cart = [];
let deliveryCharge = 0;
let promoCharge = 0;
let appliedDiscount = 0;
const promoCodes = {
  ostad10: 0.1, // 10% discount
  ostad5: 0.05, // 5% discount
};

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

// Function to handle promo code application
const handlePromoCharge = () => {
  const promoInput = document
    .querySelector("#promoCode")
    .value.trim()
    .toLowerCase();
  const messageElem = document.querySelector("#message");

  if (promoCodes[promoInput]) {
    if (appliedDiscount > 0) {
      messageElem.textContent = "Promo code already applied.";
      messageElem.className = "text-yellow-500 mt-2";
      return;
    }

    appliedDiscount = promoCodes[promoInput];
    promoCharge = calculateTotal() * appliedDiscount;
    messageElem.textContent = "Promo code applied successfully!";
    messageElem.className = "text-green-500 mt-2";
    renderCart();
  } else {
    messageElem.textContent = "Invalid promo code. Please try again.";
    messageElem.className = "text-red-500 mt-2";
  }
};

// Function to calculate the total cost
const calculateTotal = () => {
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Function to render the cart section
const renderCart = () => {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSection = document.querySelector("#cartSectionRender");
  const totalCost = calculateTotal();
  const discountAmount = totalCost * appliedDiscount;
  const finalTotal = totalCost - discountAmount + deliveryCharge;

  cartSection.innerHTML = `
    <h1 class="text-lg font-bold mb-4">Cart</h1>
    ${
      cart.length === 0
        ? `<p class="text-slate-400">Your cart is empty.</p>`
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

    <div class="text-black">
      <input type="radio" name="delivery_charge" class="radio" id="outside_dhaka" onclick="handleDeliveryCharge(1.70)" ${
        deliveryCharge === 1.7 ? "checked" : ""
      }/>
      <label for="outside_dhaka" class="radio-label">Outside Dhaka delivery charge  <span class=""> $1.70</span></label><br />
      <input type="radio" name="delivery_charge" class="radio" id="inside_dhaka" onclick="handleDeliveryCharge(0.80)" ${
        deliveryCharge === 0.8 ? "checked" : ""
      }/>
      <label for="inside_dhaka" class="radio-label">Inside Dhaka delivery charge  <span class=""> $0.80</span></label>
    </div>
    
    <hr class="my-4">

    <label for="promoCode" class="block mb-2 font-semibold">Enter Promo Code</label>
    <div class="flex items-center space-x-2">
      <input id="promoCode" type="text" class="p-2 border rounded-sm outline-none w-full" placeholder="Enter promo code" />
      <button id="applyPromoBtn" class="bg-black text-white px-6 py-2 rounded-sm hover:bg-gray-800" onclick="handlePromoCharge()">
        Apply
      </button>
    </div>
    <p id="message" class="text-sm mt-4"></p>

    <hr class="my-6">

    <div class="flex justify-between items-center gap-20 font-semibold">
      <span>Total Items:</span>
      <span>${totalItems}</span>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Subtotal:</h3>
      <p class="font-bold">$${totalCost.toFixed(2)}</p>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Discount:</h3>
      <p class="font-bold text-green-500">$${discountAmount.toFixed(2)}</p>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Delivery Charge:</h3>
      <p class="font-bold">$${deliveryCharge.toFixed(2)}</p>
    </div>
    <hr class="my-4">
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Total:</h3>
      <p class="font-bold">$${finalTotal.toFixed(2)}</p>
    </div>

    <button
          id="buy-btn-modal"
          class="bg-black text-white hover:bg-gray-800 px-6 py-3 block w-full rounded-sm mt-4"
          onclick="my_modal_1.showModal()"
        >
          Buy
    </button>
    <dialog id="my_modal_1" class="modal p-4">
          <div class="modal-box">
            <div id="buy-Modal-section" class="mt-4"></div>
          </div>
    </dialog>

    <button class="bg-black text-white px-6 py-2 rounded-sm block w-full mt-4 hover:bg-gray-800" onclick="clearCart()">Clear Cart</button>
    `
    }
  `;

  // Update modal content
  updateModalCart();
  updateBuyModal();
};

const updateBuyModal = () => {
  const buyModalSection = document.querySelector("#buy-Modal-section");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCost = calculateTotal();
  const discountAmount = totalCost * appliedDiscount;
  const finalTotal = totalCost - discountAmount + deliveryCharge;

  if (!buyModalSection) {
    console.error("Buy Modal Section not found in the DOM");
    return;
  }

  if (cart.length === 0) {
    buyModalSection.innerHTML = `
      <p class="text-center text-gray-500">Your cart is empty.</p>
    `;
    return;
  }

  buyModalSection.innerHTML = `
    <div>
    <p class="font-semibold text-center mb-8">Purchase Successful!</p>
      ${cart
        .map(
          (item, index) => `
          
        <div
          class="flex justify-between items-center gap-24 font-semibold mb-4"
        >         
          <h4><span>${index + 1}. </span>${item.name}</h4>
          <div class="flex items-center gap-1">
            <span>${item.quantity}</span>
            <span> x </span>
            <span>${item.price.toFixed(2)}</span>
          </div>
        </div>
      `
        )
        .join("")}
      <div class="mt-4">
        <hr class="my-4">  
        <div class="flex justify-between items-center gap-20 font-semibold">
      <span>Total Items:</span>
      <span>${totalItems}</span>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Subtotal:</h3>
      <p class="font-bold">$${totalCost.toFixed(2)}</p>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Discount:</h3>
      <p class="font-bold text-green-500">$${discountAmount.toFixed(2)}</p>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Delivery Charge:</h3>
      <p class="font-bold">$${deliveryCharge.toFixed(2)}</p>
    </div>
    <hr class="my-4">
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Total:</h3>
      <p class="font-bold">$${finalTotal.toFixed(2)}</p>
    </div>
        
        
      </div>
      <div class="modal-action mt-6">
        <form method="dialog">
          <button
            class="bg-black text-white hover:bg-gray-800 text-sm px-4 py-1 rounded-sm"
          >
            Close
          </button>
        </form>
      </div>
    </div>
  `;
};

// Updated updateModalCart function to include delivery charge
const updateModalCart = () => {
  const modalCartSection = document.querySelector("#modal-cart-section");
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalCost = calculateTotal();
  const discountAmount = totalCost * appliedDiscount;
  const finalTotal = totalCost - discountAmount + deliveryCharge;

  if (cart.length === 0) {
    modalCartSection.innerHTML = `
      <p class="text-center text-gray-500">Your cart is empty.</p>
    `;
    return;
  }
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
    <div class="flex justify-between items-center gap-20 font-semibold">
      <span>Total Items:</span>
      <span>${totalItems}</span>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Subtotal:</h3>
      <p class="font-bold">$${totalCost.toFixed(2)}</p>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Discount:</h3>
      <p class="font-bold text-green-500">$${discountAmount.toFixed(2)}</p>
    </div>
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Delivery Charge:</h3>
      <p class="font-bold">$${deliveryCharge.toFixed(2)}</p>
    </div>
    <hr class="my-4">
    <div class="flex justify-between items-center">
      <h3 class="font-bold">Total:</h3>
      <p class="font-bold">$${finalTotal.toFixed(2)}</p>
    </div>
  `;
};

const handleDeliveryCharge = (charge) => {
  deliveryCharge = charge;
  renderCart();
};

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

const clearCart = () => {
  cart = [];
  appliedDiscount = 0;
  promoCharge = 0;
  deliveryCharge = 0;
  updateCartCount();
  renderCart();
};
