// Seed data script to populate the database with initial data
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/database');
const User = require('../models/User');
const Property = require('../models/Property');

const seedData = async () => {
    try {
        // Connect to database
        await connectDB();

        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Property.deleteMany({});

        console.log('Creating users...');
        // Create sample users
        const users = await User.create([
            {
                username: 'admin',
                email: 'admin@futelatosomba.com',
                password: 'admin123',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                isVerified: true,
                isPremium: true
            },
            {
                username: 'agent1',
                email: 'agent1@futelatosomba.com',
                password: 'agent123',
                firstName: 'Jean',
                lastName: 'Mukendi',
                phone: '+243 XX XXX XXXX',
                role: 'agent',
                isVerified: true
            },
            {
                username: 'testuser',
                email: 'user@futelatosomba.com',
                password: 'user123',
                firstName: 'Test',
                lastName: 'User',
                phone: '+243 XX XXX XXXX',
                role: 'user',
                isVerified: true
            }
        ]);

        console.log(`Created ${users.length} users`);

        console.log('Creating properties...');
        // Create sample properties
        const properties = await Property.create([
            {
                title: 'Modern Villa in Gombe',
                description: 'Luxurious modern villa with stunning city views, spacious rooms, and high-end finishes. Located in the prestigious Gombe neighborhood, this property offers the perfect blend of comfort and elegance.',
                price: 450000,
                listingType: 'sale',
                propertyType: 'Villa',
                bedrooms: 4,
                bathrooms: 3,
                area: 350,
                location: {
                    address: 'Avenue de la Liberation',
                    city: 'Kinshasa',
                    province: 'Kinshasa',
                    coordinates: { lat: -4.3095, lng: 15.3165 }
                },
                images: [{
                    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
                    isPrimary: true
                }],
                features: ['Garden', 'Modern Kitchen', 'Garage', 'Security System'],
                amenities: ['Parking', 'Garden', 'Security', 'Generator', 'Water Tank'],
                owner: users[1]._id,
                status: 'active',
                isPremium: true,
                premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            },
            {
                title: 'Cozy Apartment in Ngaliema',
                description: 'Comfortable 2-bedroom apartment perfect for families, close to schools and markets. This well-maintained unit offers a peaceful living environment in a secure building.',
                price: 800,
                listingType: 'rent',
                propertyType: 'Apartment',
                bedrooms: 2,
                bathrooms: 1,
                area: 85,
                location: {
                    address: 'Boulevard du 30 Juin',
                    city: 'Kinshasa',
                    province: 'Kinshasa',
                    coordinates: { lat: -4.3773, lng: 15.2626 }
                },
                images: [{
                    url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
                    isPrimary: true
                }],
                features: ['Balcony', 'Modern Finishes', 'Well Lit'],
                amenities: ['Parking', 'Security', 'Generator', 'Water Tank'],
                owner: users[1]._id,
                status: 'active'
            },
            {
                title: 'Commercial Space in Ma Campagne',
                description: 'Prime commercial space in busy area, ideal for retail or office use. High foot traffic and excellent visibility make this the perfect location for your business.',
                price: 250000,
                listingType: 'sale',
                propertyType: 'Commercial',
                bedrooms: 0,
                bathrooms: 2,
                area: 200,
                location: {
                    address: 'Avenue Kabambare',
                    city: 'Kinshasa',
                    province: 'Kinshasa',
                    coordinates: { lat: -4.3340, lng: 15.3134 }
                },
                images: [{
                    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
                    isPrimary: true
                }],
                features: ['Ground Floor', 'High Ceiling', 'Display Windows'],
                amenities: ['Parking', 'Security', 'Internet'],
                owner: users[1]._id,
                status: 'active'
            },
            {
                title: 'Spacious House in Limete',
                description: 'Well-maintained house with garden, secure neighborhood, near amenities. Perfect for families looking for a comfortable home with outdoor space.',
                price: 1200,
                listingType: 'rent',
                propertyType: 'House',
                bedrooms: 3,
                bathrooms: 2,
                area: 150,
                location: {
                    address: 'Avenue Kabinda',
                    city: 'Kinshasa',
                    province: 'Kinshasa',
                    coordinates: { lat: -4.3661, lng: 15.3056 }
                },
                images: [{
                    url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
                    isPrimary: true
                }],
                features: ['Fenced Compound', 'Covered Parking', 'Storage Room'],
                amenities: ['Parking', 'Garden', 'Security', 'Generator', 'Water Tank'],
                owner: users[1]._id,
                status: 'active'
            },
            {
                title: 'Land Plot in Kintambo',
                description: 'Prime residential land plot ready for development, all utilities available. Excellent investment opportunity in a growing neighborhood.',
                price: 120000,
                listingType: 'sale',
                propertyType: 'Land',
                bedrooms: 0,
                bathrooms: 0,
                area: 500,
                location: {
                    address: 'Avenue Kintambo',
                    city: 'Kinshasa',
                    province: 'Kinshasa',
                    coordinates: { lat: -4.3217, lng: 15.2857 }
                },
                images: [{
                    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
                    isPrimary: true
                }],
                features: ['Flat Terrain', 'Corner Plot', 'Clear Title'],
                amenities: [],
                owner: users[1]._id,
                status: 'active'
            },
            {
                title: 'Luxury Apartment in Gombe',
                description: 'High-end apartment with modern amenities, concierge service, and parking. Enjoy the best of city living with breathtaking views and premium finishes.',
                price: 2500,
                listingType: 'rent',
                propertyType: 'Apartment',
                bedrooms: 3,
                bathrooms: 2,
                area: 180,
                location: {
                    address: 'Avenue Tombalbaye',
                    city: 'Kinshasa',
                    province: 'Kinshasa',
                    coordinates: { lat: -4.3185, lng: 15.3233 }
                },
                images: [{
                    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
                    isPrimary: true
                }],
                features: ['City Views', 'Open Floor Plan', 'High-End Appliances'],
                amenities: ['Parking', 'Security', 'Generator', 'Gym', 'Elevator', 'Internet', 'Air Conditioning'],
                owner: users[1]._id,
                status: 'active',
                isPremium: true,
                premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        ]);

        console.log(`Created ${properties.length} properties`);
        console.log('\n=================================');
        console.log('Seed data created successfully!');
        console.log('=================================\n');
        console.log('Test Users:');
        console.log('1. Admin - admin@futelatosomba.com / admin123');
        console.log('2. Agent - agent1@futelatosomba.com / agent123');
        console.log('3. User  - user@futelatosomba.com / user123');
        console.log('\nYou can now start the server and test the application!');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

// Run seed function
seedData();
