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
const continueShoppingButton = document.getElementById('continueShopping');
const proceedToPaymentButton = document.getElementById('proceedToPayment');

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
    
    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex(p => p.id === productId);
    
    if (existingProductIndex !== -1) {
        // Increment quantity if product exists
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        // Add new product with quantity
        cart.push({...product, quantity: 1});
    }
    
    updateCartCount(); // Update cart count display
    saveCart(); // Persist cart state to localStorage
    
    // If on cart page, re-render cart
    if (cartItems) {
        renderCart();
    }
    
    alert('Product added to cart!');
}

// Render cart
function renderCart() {
    if (!cartItems) return; // Ensure the cart container exists on the page

    // Generate the cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <span>${item.name}</span>
            <span>₹${item.price}</span>
            <div class="quantity-control">
                <button onclick="decreaseQuantity(${item.id})">-</button>
                <span>${item.quantity || 1}</span>
                <button onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    // Update the cart total
    cartTotal.textContent = `Total: ₹${calculateTotal()}`;
}

// Increase quantity
function increaseQuantity(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        cart[productIndex].quantity = (cart[productIndex].quantity || 1) + 1;
        renderCart();
        updateCartCount();
        saveCart();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex !== -1) {
        if (cart[productIndex].quantity > 1) {
            cart[productIndex].quantity -= 1;
        } else {
            // If quantity is 1, remove the item
            cart.splice(productIndex, 1);
        }
        renderCart();
        updateCartCount();
        saveCart();
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== Number(productId)); // Filter out the item
    updateCartCount(); // Update cart count
    renderCart(); // Refresh cart display
    saveCart(); // Persist updated cart
}

// Buy now
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    cart = [{...product, quantity: 1}];
    updateCartCount();
    saveCart();
    // Redirect to cart page
    window.location.href = 'cart.html';
}

// Update cart count
function updateCartCount() {
    if (!cartCount) return; // Ensure cartCount exists
    
    // Calculate total number of items (considering quantities)
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    cartCount.textContent = totalItems; 
    saveCart(); // Persist updated cart
}

// Calculate total
function calculateTotal() {
    return cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
}

// Event listeners for cart page buttons
if (proceedToPaymentButton) {
    proceedToPaymentButton.addEventListener('click', showPaymentModal);
}

if (continueShoppingButton) {
    continueShoppingButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}

// Show payment modal
function showPaymentModal() {
    if (paymentModal && paymentAmount) {
        paymentModal.style.display = 'block';
        paymentAmount.textContent = calculateTotal();
    }
}

// Initialize
if (productsContainer) {
    renderProducts(); // Render products on the products page
} else if (cartItems) {
    renderCart(); // Render the cart on the cart page
    updateCartCount(); // Update the cart count
}