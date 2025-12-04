// Stripe Integration for futelatosomba
// This file handles all Stripe-related functionality including donations and premium listings

let stripe;
let elements;

// Initialize Stripe
function initializeStripe() {
    if (window.Stripe && CONFIG.STRIPE_PUBLISHABLE_KEY) {
        stripe = Stripe(CONFIG.STRIPE_PUBLISHABLE_KEY);
        console.log('Stripe initialized successfully');
    } else {
        console.error('Stripe.js not loaded or publishable key missing');
    }
}

// Load Stripe.js library
function loadStripeScript() {
    return new Promise((resolve, reject) => {
        if (window.Stripe) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => {
            initializeStripe();
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Donation functionality
async function handleDonation() {
    try {
        await loadStripeScript();

        // Create donation modal
        const modal = createDonationModal();
        document.body.appendChild(modal);
        modal.classList.remove('hidden');
    } catch (error) {
        console.error('Error loading Stripe:', error);
        alert('Unable to load payment system. Please try again later.');
    }
}

function createDonationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'donation-modal';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="closeDonationModal()">&times;</span>
            <h2 style="margin-bottom: 1.5rem; color: #333;">Support Our Community Kids</h2>

            <p style="margin-bottom: 1.5rem; color: #666;">
                Choose a donation amount or enter a custom amount:
            </p>

            <div id="donation-amounts" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                ${CONFIG.DONATION_AMOUNTS.map(amount => `
                    <button class="donation-amount-btn" data-amount="${amount.value}" style="padding: 1rem; border: 2px solid #667eea; background: white; color: #667eea; border-radius: 5px; cursor: pointer; font-size: 1.1rem; transition: all 0.3s;">
                        ${amount.label}
                    </button>
                `).join('')}
            </div>

            <div id="custom-amount-container" class="hidden" style="margin-bottom: 1.5rem;">
                <label style="display: block; margin-bottom: 0.5rem; color: #333; font-weight: bold;">Custom Amount (USD):</label>
                <input type="number" id="custom-amount-input" min="1" step="0.01" placeholder="Enter amount" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem;">
            </div>

            <button id="proceed-to-payment-btn" class="donation-button" style="width: 100%; padding: 1rem; margin-top: 1rem;" disabled>
                Proceed to Payment
            </button>

            <div id="payment-element" class="hidden" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid #ddd;">
                <!-- Stripe payment element will be mounted here -->
            </div>

            <div id="payment-message" class="hidden" style="margin-top: 1rem; padding: 1rem; border-radius: 5px;"></div>
        </div>
    `;

    // Add event listeners
    setTimeout(() => {
        attachDonationModalListeners();
    }, 100);

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDonationModal();
        }
    });

    return modal;
}

function attachDonationModalListeners() {
    const amountButtons = document.querySelectorAll('.donation-amount-btn');
    const customAmountContainer = document.getElementById('custom-amount-container');
    const customAmountInput = document.getElementById('custom-amount-input');
    const proceedButton = document.getElementById('proceed-to-payment-btn');

    let selectedAmount = 0;

    amountButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            amountButtons.forEach(b => {
                b.style.background = 'white';
                b.style.color = '#667eea';
            });

            // Add active class to clicked button
            btn.style.background = '#667eea';
            btn.style.color = 'white';

            const amount = btn.dataset.amount;

            if (amount === 'custom') {
                customAmountContainer.classList.remove('hidden');
                selectedAmount = 0;
                proceedButton.disabled = true;
            } else {
                customAmountContainer.classList.add('hidden');
                selectedAmount = parseInt(amount);
                proceedButton.disabled = false;
            }
        });
    });

    if (customAmountInput) {
        customAmountInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (value && value > 0) {
                selectedAmount = Math.round(value * 100); // Convert to cents
                proceedButton.disabled = false;
            } else {
                proceedButton.disabled = true;
            }
        });
    }

    if (proceedButton) {
        proceedButton.addEventListener('click', () => {
            if (selectedAmount > 0) {
                processDonation(selectedAmount);
            }
        });
    }
}

async function processDonation(amount) {
    try {
        showPaymentMessage('Processing...', 'info');

        // Call backend to create payment intent
        const response = await fetch(`${CONFIG.API_BASE_URL}/create-donation-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount })
        });

        if (!response.ok) {
            throw new Error('Failed to create payment');
        }

        const { clientSecret } = await response.json();

        // Redirect to Stripe Checkout or use Payment Element
        const { error } = await stripe.confirmPayment({
            clientSecret,
            confirmParams: {
                return_url: `${window.location.origin}/payment-success.html`,
            },
        });

        if (error) {
            showPaymentMessage(error.message, 'error');
        }
    } catch (error) {
        console.error('Payment error:', error);
        showPaymentMessage('Payment failed. Please try again.', 'error');
    }
}

// Premium listing functionality
async function handlePremiumListing() {
    try {
        await loadStripeScript();

        showPaymentMessage('Processing payment...', 'info');

        // Call backend to create checkout session
        const response = await fetch(`${CONFIG.API_BASE_URL}/create-premium-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: CONFIG.PREMIUM_LISTING_PRICE
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create checkout session');
        }

        const { sessionId } = await response.json();

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
            sessionId: sessionId
        });

        if (error) {
            showPaymentMessage(error.message, 'error');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Payment system unavailable. Please try again later.');
    }
}

function closeDonationModal() {
    const modal = document.getElementById('donation-modal');
    if (modal) {
        modal.remove();
    }
}

function showPaymentMessage(message, type) {
    const messageElement = document.getElementById('payment-message');
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.className = '';
        messageElement.classList.add('payment-message');

        if (type === 'error') {
            messageElement.style.background = '#fee';
            messageElement.style.color = '#c00';
            messageElement.style.border = '1px solid #fcc';
        } else if (type === 'success') {
            messageElement.style.background = '#efe';
            messageElement.style.color = '#0a0';
            messageElement.style.border = '1px solid #cfc';
        } else {
            messageElement.style.background = '#eef';
            messageElement.style.color = '#00a';
            messageElement.style.border = '1px solid #ccf';
        }

        messageElement.classList.remove('hidden');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load Stripe script
    loadStripeScript().catch(err => {
        console.error('Failed to load Stripe:', err);
    });

    // Attach donate button listener
    const donateButton = document.getElementById('donate-button');
    if (donateButton) {
        donateButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleDonation();
        });
    }
});

// Make functions globally accessible
window.handleDonation = handleDonation;
window.handlePremiumListing = handlePremiumListing;
window.closeDonationModal = closeDonationModal;
