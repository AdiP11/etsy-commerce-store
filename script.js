// Cart management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartModal = document.getElementById('cartModal');
const paymentModal = document.getElementById('paymentModal');
const cartButton = document.getElementById('cartButton');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const checkoutButton = document.getElementById('checkoutButton');
const paymentAmount = document.getElementById('paymentAmount');
const payNowButton = document.getElementById('payNow');

// Render products
function renderProducts() {
    if (!productsContainer || !products) {
        console.error("Products container or products data not available");
        return;
    }
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="buyNow(${product.id})">Buy Now</button>
        </div>
    `).join('');
    console.log("Products rendered successfully");
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        console.error("Product not found");
        return;
    }
    cart.push(product); // Add product to cart
    updateCartCount(); // Update cart count display
    saveCart(); // Persist cart state to localStorage
    alert('Product added to cart!');
}

//render cart
function renderCart() {
    if (!cartItems) return; // Ensure the cart container exists on the page

    // Generate the cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>₹${item.price}</span>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    // Update the cart total
    cartTotal.textContent = `Total: ₹${calculateTotal()}`;
}

//remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== Number(productId)); // Filter out the item
    updateCartCount(); // Update cart count
    renderCart(); // Refresh cart display
    saveCart(); // Persist updated cart
}


// Buy now
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    cart = [product];
    updateCartCount();
    saveCart();
    showPaymentModal();
}

// Update cart count
function updateCartCount() {
    if (!cartCount) return; // Ensure cartCount exists
    cartCount.textContent = cart.length; // Update the count
    saveCart(); // Persist updated cart
}


// Calculate total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

// Initialize
if (productsContainer) {
    renderProducts(); // Render products on the products page
} else if (cartItems) {
    renderCart(); // Render the cart on the cart page
    updateCartCount(); // Update the cart count
}

