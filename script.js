// Cart management
let cart = [];

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
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>₹${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
            <button onclick="buyNow(${product.id})">Buy Now</button>
        </div>
    `).join('');
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartCount();
    alert('Product added to cart!');
}

// Buy now
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    cart = [product];
    updateCartCount();
    showPaymentModal();
}

// Update cart count
function updateCartCount() {
    cartCount.textContent = cart.length;
}

// Calculate total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

// Render cart items
function renderCart() {
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>₹${item.price}</span>
            <button onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
    `).join('');
    cartTotal.textContent = `Total: ₹${calculateTotal()}`;
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}

// Show payment modal
function showPaymentModal() {
    paymentAmount.textContent = calculateTotal();
    cartModal.style.display = 'none';
    paymentModal.style.display = 'block';
}

// Event Listeners
cartButton.onclick = () => {
    cartModal.style.display = 'block';
    renderCart();
};

document.getElementById('closeCart').onclick = () => {
    cartModal.style.display = 'none';
};

document.getElementById('closePayment').onclick = () => {
    paymentModal.style.display = 'none';
};

checkoutButton.onclick = showPaymentModal;

payNowButton.onclick = () => {
    // Implement UPI payment integration here
    const amount = calculateTotal();
    const upiId = document.getElementById('upiId').textContent;
    
    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=Store&am=${amount}&cu=INR`;
    
    // Open UPI payment
    window.location.href = upiUrl;
    
    // Clear cart after payment
    cart = [];
    updateCartCount();
    paymentModal.style.display = 'none';
};

// Initialize
renderProducts();