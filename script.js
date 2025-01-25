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

// Add UPI payment functionality and cancel button behavior
function initializePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const cartModal = document.getElementById('cartModal');
    const payNowButton = document.getElementById('payNow');
    const cancelPaymentButton = document.getElementById('cancelPayment');
    const proceedToPaymentButton = document.getElementById('proceedToPayment');
    const continueShoppingButton = document.getElementById('continueShopping');

    // Proceed to Payment Button (from Cart Modal)
    if (proceedToPaymentButton) {
        proceedToPaymentButton.addEventListener('click', (e) => {
            e.preventDefault();
            showPaymentModal();
        });
    }

    // Pay Now Button (in Payment Modal)
    if (payNowButton) {
        payNowButton.addEventListener('click', (e) => {
            e.preventDefault();
            const upiId = document.getElementById('upiId').textContent;
            const totalAmount = calculateTotal();
            
            // Payment processing logic
            if (navigator.userAgent.toLowerCase().includes('android')) {
                // Android UPI intent
                window.location.href = `upi://pay?pa=${upiId}&pn=MyStore&am=${totalAmount}&tn=Payment%20for%20your%20order`;
            } else if (navigator.userAgent.toLowerCase().includes('iphone')) {
                // iOS payment guidance
                alert('Please use your preferred UPI app with this UPI ID: ' + upiId);
            } else {
                // Fallback for desktop or unsupported devices
                alert('Please use your mobile device with UPI apps to complete the payment.\n\nUPI ID: ' + upiId + '\nTotal Amount: ₹' + totalAmount);
            }
            
            // Clear cart after successful payment simulation
            cart = [];
            saveCart();
            updateCartCount();
            
            // Redirect to home page or show confirmation
            window.location.href = 'index.html';
        });
    }

    // Cancel Payment Button
    if (cancelPaymentButton) {
        cancelPaymentButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Hide payment modal
            if (paymentModal) {
                paymentModal.style.display = 'none';
            }
            
            // Show cart modal again if on cart page
            if (cartModal) {
                cartModal.style.display = 'block';
            }
        });
    }

    // Continue Shopping Button
    if (continueShoppingButton) {
        continueShoppingButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
}

// Enhance the existing showPaymentModal function
function showPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const cartModal = document.getElementById('cartModal');
    const paymentAmount = document.getElementById('paymentAmount');

    if (paymentModal && paymentAmount) {
        // Hide cart modal
        if (cartModal) {
            cartModal.style.display = 'none';
        }
        
        // Show payment modal
        paymentModal.style.display = 'block';
        paymentAmount.textContent = `₹${calculateTotal()}`;
    }
}

// Ensure event listeners are set up after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePaymentModal();
    
    // Render products or cart based on page
    if (productsContainer) {
        renderProducts();
    } else if (cartItems) {
        renderCart();
        updateCartCount();
    }
});
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

    const existingProductIndex = cart.findIndex(p => p.id === productId);
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity = (cart[existingProductIndex].quantity || 1) + 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();
    saveCart();

    if (cartItems) {
        renderCart();
    }

    showToast('Product added to cart!'); // Subtle notification
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

// Add UPI payment functionality and cancel button behavior
function initializePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const payNowButton = document.getElementById('payNow');
    const cancelPaymentButton = document.getElementById('cancelPayment');
    const cartModal = document.getElementById('cartModal');
    const upiDetails = document.getElementById('upiDetails');

    // Ensure these elements exist before adding event listeners
    if (payNowButton) {
        payNowButton.addEventListener('click', () => {
            // Open UPI payment options
            const upiId = document.getElementById('upiId').textContent;
            
            // Check if the browser supports the UPI payment intent
            if (navigator.userAgent.toLowerCase().includes('android')) {
                // Android UPI intent
                window.location.href = `upi://pay?pa=${upiId}&pn=MyStore&am=${calculateTotal()}&tn=Payment%20for%20your%20order`;
            } else if (navigator.userAgent.toLowerCase().includes('iphone')) {
                // iOS might require a different approach
                alert('Please use your preferred UPI app with this UPI ID: ' + upiId);
            } else {
                // Fallback for desktop or unsupported devices
                alert('Please use your mobile device with UPI apps to complete the payment.\n\nUPI ID: ' + upiId);
            }
        });
    }

    // Add cancel button functionality
    if (cancelPaymentButton) {
        cancelPaymentButton.addEventListener('click', () => {
            // Hide payment modal
            if (paymentModal) {
                paymentModal.style.display = 'none';
            }
            
            // Optionally, show cart modal again
            if (cartModal) {
                cartModal.style.display = 'block';
            }
        });
    }

    // If multiple cancel buttons exist (in different modals)
    const cancelButtons = document.querySelectorAll('.cart-actions button:last-child');
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Close any open modals
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            
            // Redirect to products page
            window.location.href = 'index.html';
        });
    });
}

// Enhance the existing showPaymentModal function
function showPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const cartModal = document.getElementById('cartModal');
    const paymentAmount = document.getElementById('paymentAmount');

    if (paymentModal && paymentAmount) {
        // Hide cart modal
        if (cartModal) {
            cartModal.style.display = 'none';
        }
        
        // Show payment modal
        paymentModal.style.display = 'block';
        paymentAmount.textContent = calculateTotal();
    }
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

// Initialize payment modal functionality
document.addEventListener('DOMContentLoaded', initializePaymentModal);

// Initialize
if (productsContainer) {
    renderProducts(); // Render products on the products page
} else if (cartItems) {
    renderCart(); // Render the cart on the cart page
    updateCartCount(); // Update the cart count
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300); // Cleanup
    }, 3000); // Display for 3 seconds
}
// Add customer information and order history management
let customerInfo = {};
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];

// Function to render customer information form
function renderCustomerInfoForm() {
    const customerInfoModal = document.createElement('div');
    customerInfoModal.id = 'customerInfoModal';
    customerInfoModal.className = 'modal';
    customerInfoModal.innerHTML = `
        <div class="modal-content">
            <h2>Customer Information</h2>
            <form id="customerInfoForm">
                <input type="text" id="fullName" placeholder="Full Name" required>
                <input type="email" id="email" placeholder="Email" required>
                <input type="tel" id="phone" placeholder="Phone Number" required>
                <textarea id="address" placeholder="Delivery Address" required></textarea>
                <div class="cart-actions">
                    <button type="submit">Proceed to Payment</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(customerInfoModal);

    const customerInfoForm = document.getElementById('customerInfoForm');
    customerInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        customerInfo = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        customerInfoModal.style.display = 'none';
        showPaymentModal();
    });

    customerInfoModal.style.display = 'block';
}

// Modify payment process to save order
function saveOrder() {
    const order = {
        id: Date.now(),
        customer: customerInfo,
        items: cart,
        total: calculateTotal(),
        date: new Date().toISOString()
    };

    orderHistory.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
}

// Function to display order history
function displayOrderHistory() {
    const orderHistoryContent = document.getElementById('orderHistoryContent');
    if (!orderHistoryContent) return;

    if (orderHistory.length === 0) {
        orderHistoryContent.innerHTML = '<p>No order history found.</p>';
        return;
    }

    orderHistoryContent.innerHTML = orderHistory.map(order => `
        <div class="order-entry">
            <h3>Order #${order.id}</h3>
            <p>Date: ${new Date(order.date).toLocaleString()}</p>
            <div class="customer-details">
                <strong>Customer:</strong> ${order.customer.fullName}<br>
                <strong>Email:</strong> ${order.customer.email}<br>
                <strong>Phone:</strong> ${order.customer.phone}<br>
                <strong>Address:</strong> ${order.customer.address}
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div>
                        ${item.name} - Qty: ${item.quantity} - ₹${item.price * item.quantity}
                    </div>
                `).join('')}
            </div>
            <strong>Total: ₹${order.total}</strong>
        </div>
    `).join('');
}

// Modify existing payment button logic
const originalPayNowButtonLogic = payNowButton ? payNowButton.onclick : null;
if (payNowButton) {
    payNowButton.addEventListener('click', (e) => {
        e.preventDefault();
        saveOrder();
        
        // Existing payment logic
        const upiId = document.getElementById('upiId').textContent;
        const totalAmount = calculateTotal();
        
        if (navigator.userAgent.toLowerCase().includes('android')) {
            window.location.href = `upi://pay?pa=${upiId}&pn=MyStore&am=${totalAmount}&tn=Payment%20for%20your%20order`;
        } else {
            alert('Please use your mobile device with UPI apps to complete the payment.');
        }
        
        cart = [];
        saveCart();
        updateCartCount();
        
        window.location.href = 'index.html';
    });
}

// Modify proceed to payment to show customer info form
if (proceedToPaymentButton) {
    proceedToPaymentButton.addEventListener('click', (e) => {
        e.preventDefault();
        renderCustomerInfoForm();
    });
}

// Add event listener for order history (if page exists)
document.addEventListener('DOMContentLoaded', () => {
    const orderHistoryContent = document.getElementById('orderHistoryContent');
    if (orderHistoryContent) {
        displayOrderHistory();
    }
});

// Existing payment modal enhancement
function showPaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    const cartModal = document.getElementById('cartModal');
    const paymentAmount = document.getElementById('paymentAmount');

    if (paymentModal && paymentAmount) {
        // Hide cart modal
        if (cartModal) {
            cartModal.style.display = 'none';
        }
        
        // Show payment modal
        paymentModal.style.display = 'block';
        paymentAmount.textContent = calculateTotal();

        // Add customer details to payment modal
        const customerDetailsContainer = document.getElementById('customerDetails');
        if (customerDetailsContainer) {
            customerDetailsContainer.innerHTML = `
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> ${customerInfo.fullName}</p>
                <p><strong>Email:</strong> ${customerInfo.email}</p>
                <p><strong>Phone:</strong> ${customerInfo.phone}</p>
                <p><strong>Address:</strong> ${customerInfo.address}</p>
            `;
        }
    }
}