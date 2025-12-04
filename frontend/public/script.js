// Main JavaScript file for futelatosomba

// Sample property data
let properties = [
    {
        id: 1,
        title: 'Modern Villa in Gombe',
        price: 450000,
        bedrooms: 4,
        bathrooms: 3,
        area: 350,
        type: 'Villa',
        listingType: 'sale',
        location: 'Gombe, Kinshasa',
        description: 'Luxurious modern villa with stunning city views, spacious rooms, and high-end finishes.',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
        coordinates: { lat: -4.3095, lng: 15.3165 }
    },
    {
        id: 2,
        title: 'Cozy Apartment in Ngaliema',
        price: 800,
        bedrooms: 2,
        bathrooms: 1,
        area: 85,
        type: 'Apartment',
        listingType: 'rent',
        location: 'Ngaliema, Kinshasa',
        description: 'Comfortable 2-bedroom apartment perfect for families, close to schools and markets.',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
        coordinates: { lat: -4.3773, lng: 15.2626 }
    },
    {
        id: 3,
        title: 'Commercial Space in Ma Campagne',
        price: 250000,
        bedrooms: 0,
        bathrooms: 2,
        area: 200,
        type: 'Commercial',
        listingType: 'sale',
        location: 'Ma Campagne, Kinshasa',
        description: 'Prime commercial space in busy area, ideal for retail or office use.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
        coordinates: { lat: -4.3340, lng: 15.3134 }
    },
    {
        id: 4,
        title: 'Spacious House in Limete',
        price: 1200,
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        type: 'House',
        listingType: 'rent',
        location: 'Limete, Kinshasa',
        description: 'Well-maintained house with garden, secure neighborhood, near amenities.',
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
        coordinates: { lat: -4.3661, lng: 15.3056 }
    },
    {
        id: 5,
        title: 'Land Plot in Kintambo',
        price: 120000,
        bedrooms: 0,
        bathrooms: 0,
        area: 500,
        type: 'Land',
        listingType: 'sale',
        location: 'Kintambo, Kinshasa',
        description: 'Prime residential land plot ready for development, all utilities available.',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
        coordinates: { lat: -4.3217, lng: 15.2857 }
    },
    {
        id: 6,
        title: 'Luxury Apartment in Gombe',
        price: 2500,
        bedrooms: 3,
        bathrooms: 2,
        area: 180,
        type: 'Apartment',
        listingType: 'rent',
        location: 'Gombe, Kinshasa',
        description: 'High-end apartment with modern amenities, concierge service, and parking.',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        coordinates: { lat: -4.3185, lng: 15.3233 }
    }
];

// Current state
let currentListingType = 'sale';
let currentView = 'list';
let filteredProperties = [];
let currentUser = null;

// DOM Elements
const searchButton = document.getElementById('search-button');
const locationInput = document.getElementById('location-input');
const propertyTypeSelect = document.getElementById('property-type-select');
const bedroomsSelect = document.getElementById('bedrooms-select');
const minPriceInput = document.getElementById('min-price-input');
const maxPriceInput = document.getElementById('max-price-input');
const propertiesContainer = document.getElementById('properties-container');
const propertyDetailSection = document.getElementById('property-detail');
const propertyListingsSection = document.getElementById('property-listings');
const backToListingsBtn = document.getElementById('back-to-listings');
const detailContent = document.getElementById('detail-content');
const tabButtons = document.querySelectorAll('.tab-btn');
const listViewBtn = document.getElementById('list-view-btn');
const mapViewBtn = document.getElementById('map-view-btn');
const mapViewContainer = document.getElementById('map-view-container');
const mobileMenuBtn = document.getElementById('mobile-menu');
const mainNav = document.getElementById('main-nav');
const authModal = document.getElementById('auth-modal');
const headerSigninLink = document.querySelector('.header-signin-link');
const closeModalBtn = document.querySelector('.close-button');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showLoginBtn = document.getElementById('show-login');
const showRegisterBtn = document.getElementById('show-register');
const addPropertyBtn = document.getElementById('add-property-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProperties();
    attachEventListeners();
    checkUserSession();
});

// Event Listeners
function attachEventListeners() {
    searchButton.addEventListener('click', handleSearch);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentListingType = btn.dataset.tab;
            loadProperties();
        });
    });

    listViewBtn.addEventListener('click', () => {
        currentView = 'list';
        propertiesContainer.classList.remove('hidden');
        mapViewContainer.classList.add('hidden');
    });

    mapViewBtn.addEventListener('click', () => {
        currentView = 'map';
        propertiesContainer.classList.add('hidden');
        mapViewContainer.classList.remove('hidden');
        loadMapView();
    });

    backToListingsBtn.addEventListener('click', () => {
        propertyDetailSection.classList.add('hidden');
        propertyListingsSection.classList.remove('hidden');
    });

    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });

    headerSigninLink.addEventListener('click', (e) => {
        e.preventDefault();
        authModal.classList.remove('hidden');
    });

    closeModalBtn.addEventListener('click', () => {
        authModal.classList.add('hidden');
    });

    showLoginBtn.addEventListener('click', () => {
        showLoginBtn.classList.add('active');
        showRegisterBtn.classList.remove('active');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });

    showRegisterBtn.addEventListener('click', () => {
        showRegisterBtn.classList.add('active');
        showLoginBtn.classList.remove('active');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    if (addPropertyBtn) {
        addPropertyBtn.addEventListener('click', handleAddProperty);
    }

    // Close modal on outside click
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.classList.add('hidden');
        }
    });
}

// Load and display properties
function loadProperties() {
    filteredProperties = properties.filter(p => p.listingType === currentListingType);
    displayProperties(filteredProperties);
}

function displayProperties(propertiesToDisplay) {
    propertiesContainer.innerHTML = '';

    if (propertiesToDisplay.length === 0) {
        propertiesContainer.innerHTML = '<p style="text-align: center; color: #999;">No properties found matching your criteria.</p>';
        return;
    }

    propertiesToDisplay.forEach(property => {
        const propertyCard = createPropertyCard(property);
        propertiesContainer.appendChild(propertyCard);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.onclick = () => showPropertyDetail(property.id);

    const priceFormatted = property.listingType === 'sale'
        ? `$${property.price.toLocaleString()}`
        : `$${property.price}/month`;

    card.innerHTML = `
        <img src="${property.image}" alt="${property.title}">
        <div class="property-info">
            <h3>${property.title}</h3>
            <div class="property-price">${priceFormatted}</div>
            ${property.bedrooms > 0 ? `
            <div class="property-details">
                <span>${property.bedrooms} Beds</span>
                <span>${property.bathrooms} Baths</span>
                <span>${property.area} m²</span>
            </div>
            ` : `
            <div class="property-details">
                <span>${property.area} m²</span>
            </div>
            `}
            <p class="property-description">${property.description.substring(0, 100)}...</p>
            <p class="property-location">📍 ${property.location}</p>
        </div>
    `;

    return card;
}

function showPropertyDetail(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const priceFormatted = property.listingType === 'sale'
        ? `$${property.price.toLocaleString()}`
        : `$${property.price}/month`;

    detailContent.innerHTML = `
        <div class="property-detail-content">
            <img src="${property.image}" alt="${property.title}" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 10px; margin-bottom: 2rem;">
            <h2>${property.title}</h2>
            <div class="property-price" style="margin: 1rem 0;">${priceFormatted}</div>
            <p class="property-location" style="font-size: 1.1rem; margin-bottom: 1.5rem;">📍 ${property.location}</p>
            ${property.bedrooms > 0 ? `
            <div class="property-details" style="margin-bottom: 1.5rem;">
                <span>${property.bedrooms} Bedrooms</span>
                <span>${property.bathrooms} Bathrooms</span>
                <span>${property.area} m²</span>
                <span>${property.type}</span>
            </div>
            ` : `
            <div class="property-details" style="margin-bottom: 1.5rem;">
                <span>${property.area} m²</span>
                <span>${property.type}</span>
            </div>
            `}
            <h3>Description</h3>
            <p style="line-height: 1.8; color: #555; margin-bottom: 1.5rem;">${property.description}</p>
            <button class="donation-button" onclick="contactAgent()">Contact Agent</button>
        </div>
    `;

    propertyListingsSection.classList.add('hidden');
    propertyDetailSection.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function contactAgent() {
    alert('Contact functionality will be implemented soon!');
}

// Search functionality
function handleSearch() {
    const location = locationInput.value.toLowerCase();
    const propertyType = propertyTypeSelect.value;
    const bedrooms = bedroomsSelect.value;
    const minPrice = parseFloat(minPriceInput.value) || 0;
    const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

    filteredProperties = properties.filter(property => {
        const matchesListingType = property.listingType === currentListingType;
        const matchesLocation = !location || property.location.toLowerCase().includes(location);
        const matchesType = propertyType === 'any' || property.type === propertyType;
        const matchesBedrooms = bedrooms === 'any' ||
            (bedrooms === '4+' ? property.bedrooms >= 4 : property.bedrooms === parseInt(bedrooms));
        const matchesPrice = property.price >= minPrice && property.price <= maxPrice;

        return matchesListingType && matchesLocation && matchesType && matchesBedrooms && matchesPrice;
    });

    displayProperties(filteredProperties);
}

// Map view
function loadMapView() {
    const center = CONFIG.DEFAULT_MAP_CENTER;
    const zoom = CONFIG.DEFAULT_MAP_ZOOM;

    // Using OpenStreetMap iframe
    mapViewContainer.innerHTML = `
        <iframe
            width="100%"
            height="100%"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            src="https://www.openstreetmap.org/export/embed.html?bbox=${center.lng-0.1}%2C${center.lat-0.1}%2C${center.lng+0.1}%2C${center.lat+0.1}&amp;layer=mapnik&amp;marker=${center.lat}%2C${center.lng}"
            style="border: 1px solid #ddd; border-radius: 10px;">
        </iframe>
        <p style="text-align: center; margin-top: 1rem; color: #666;">
            <small>
                <a href="https://www.openstreetmap.org/?mlat=${center.lat}&amp;mlon=${center.lng}#map=${zoom}/${center.lat}/${center.lng}" target="_blank">View Larger Map</a>
            </small>
        </p>
    `;
}

// Authentication
function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUIForLoggedInUser();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // Simple mock authentication
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = { username: user.username };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUIForLoggedInUser();
        authModal.classList.add('hidden');
        alert('Login successful!');
    } else {
        alert('Invalid username or password');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    if (users.find(u => u.username === username)) {
        alert('Username already exists!');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    currentUser = { username };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUIForLoggedInUser();
    authModal.classList.add('hidden');
    alert('Registration successful!');
}

function updateUIForLoggedInUser() {
    if (currentUser) {
        headerSigninLink.textContent = `Hello, ${currentUser.username}`;
        headerSigninLink.onclick = (e) => {
            e.preventDefault();
            if (confirm('Do you want to log out?')) {
                logout();
            }
        };
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    headerSigninLink.textContent = 'Sign in or create an account';
    headerSigninLink.onclick = (e) => {
        e.preventDefault();
        authModal.classList.remove('hidden');
    };
    alert('Logged out successfully');
}

// Add property
function handleAddProperty() {
    if (!currentUser) {
        alert('Please log in to add a property');
        authModal.classList.remove('hidden');
        return;
    }

    alert('Add property form will be implemented with premium Stripe integration!');
}
