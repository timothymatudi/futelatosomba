// Database seeding script for futelatosomba
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Property = require('../models/Property');

const MONGO_URI = process.env.MONGO_DATABASE_URL || 'mongodb://localhost:27017/futelatosomba';

// Sample users
const users = [
    {
        username: 'admin',
        email: 'admin@futelatosomba.com',
        password: 'Admin@123',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        phone: '+243 900 000 001'
    },
    {
        username: 'agent_kinshasa',
        email: 'agent@kinshasa-realty.com',
        password: 'Agent@123',
        firstName: 'Jean',
        lastName: 'Kabongo',
        role: 'agent',
        phone: '+243 900 000 002',
        agencyName: 'Kinshasa Premier Realty',
        licenseNumber: 'DRC-RE-2024-001',
        agencyAddress: 'Boulevard du 30 Juin, Gombe, Kinshasa',
        isPremium: true
    },
    {
        username: 'agent_lubumbashi',
        email: 'contact@lubumbashi-homes.com',
        password: 'Agent@123',
        firstName: 'Marie',
        lastName: 'Tshimanga',
        role: 'agent',
        phone: '+243 900 000 003',
        agencyName: 'Lubumbashi Luxury Homes',
        licenseNumber: 'DRC-RE-2024-002',
        agencyAddress: 'Avenue Mobutu, Lubumbashi',
        isPremium: true
    },
    {
        username: 'john_buyer',
        email: 'john@example.com',
        password: 'User@123',
        firstName: 'John',
        lastName: 'Mukendi',
        role: 'user',
        phone: '+243 900 000 004'
    }
];

// Sample properties
const properties = [
    {
        title: 'Modern Villa in Gombe',
        description: 'Stunning 5-bedroom villa in the heart of Gombe, Kinshasa\'s diplomatic district. Features include marble floors, modern kitchen, spacious garden, and 24/7 security.',
        price: 550000,
        currency: 'USD',
        listingType: 'sale',
        propertyType: 'villa',
        address: '123 Avenue des Aviateurs',
        city: 'Kinshasa',
        province: 'Kinshasa',
        country: 'Democratic Republic of Congo',
        zipCode: '00000',
        coordinates: {
            lat: -4.3217,
            lng: 15.3125
        },
        bedrooms: 5,
        bathrooms: 4,
        area: 450,
        yearBuilt: 2020,
        features: ['Garden', 'Swimming Pool', 'Garage', 'Security System', 'Air Conditioning'],
        amenities: ['parking', 'security', 'pool', 'garden', 'gym'],
        images: [
            { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', caption: 'Front View', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', caption: 'Living Room' },
            { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', caption: 'Master Bedroom' }
        ],
        status: 'active',
        isPremium: true,
        premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'Luxury Apartment - City Center',
        description: 'Brand new 3-bedroom apartment in downtown Kinshasa. Walking distance to shops, restaurants, and business district. Perfect for professionals.',
        price: 180000,
        currency: 'USD',
        listingType: 'sale',
        propertyType: 'apartment',
        address: '45 Boulevard du 30 Juin',
        city: 'Kinshasa',
        province: 'Kinshasa',
        country: 'Democratic Republic of Congo',
        zipCode: '00000',
        coordinates: {
            lat: -4.3276,
            lng: 15.3136
        },
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        yearBuilt: 2023,
        features: ['Balcony', 'Modern Kitchen', 'Elevator', 'Parking'],
        amenities: ['parking', 'security', 'elevator', 'internet'],
        images: [
            { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', caption: 'Building Exterior', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', caption: 'Living Area' }
        ],
        status: 'active',
        isPremium: false
    },
    {
        title: 'Commercial Space - Gombe Business District',
        description: 'Prime commercial property perfect for office or retail. High foot traffic area, excellent visibility, ample parking.',
        price: 3500,
        currency: 'USD',
        listingType: 'rent',
        propertyType: 'commercial',
        address: '89 Avenue Colonel Ebeya',
        city: 'Kinshasa',
        province: 'Kinshasa',
        country: 'Democratic Republic of Congo',
        zipCode: '00000',
        coordinates: {
            lat: -4.3190,
            lng: 15.3150
        },
        bedrooms: 0,
        bathrooms: 2,
        area: 200,
        yearBuilt: 2018,
        features: ['Air Conditioning', 'Parking', 'Security', 'High-Speed Internet'],
        amenities: ['parking', 'security', 'internet', 'power_backup'],
        images: [
            { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', caption: 'Office Space', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', caption: 'Conference Room' }
        ],
        status: 'active',
        isPremium: true,
        premiumExpiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'Spacious Family Home - Lubumbashi',
        description: '4-bedroom house in quiet residential neighborhood. Large yard, modern amenities, close to international schools.',
        price: 280000,
        currency: 'USD',
        listingType: 'sale',
        propertyType: 'house',
        address: '12 Avenue Kabalo',
        city: 'Lubumbashi',
        province: 'Haut-Katanga',
        country: 'Democratic Republic of Congo',
        zipCode: '00000',
        coordinates: {
            lat: -11.6644,
            lng: 27.4794
        },
        bedrooms: 4,
        bathrooms: 3,
        area: 300,
        yearBuilt: 2019,
        features: ['Garden', 'Garage', 'Security', 'Solar Panels'],
        amenities: ['parking', 'security', 'garden', 'power_backup'],
        images: [
            { url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', caption: 'House Front', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', caption: 'Kitchen' }
        ],
        status: 'active',
        isPremium: false
    },
    {
        title: 'Affordable Studio - Student Area',
        description: 'Cozy studio apartment perfect for students or young professionals. Furnished, utilities included.',
        price: 350,
        currency: 'USD',
        listingType: 'rent',
        propertyType: 'apartment',
        address: '78 Avenue de l\'Université',
        city: 'Kinshasa',
        province: 'Kinshasa',
        country: 'Democratic Republic of Congo',
        zipCode: '00000',
        coordinates: {
            lat: -4.3850,
            lng: 15.3900
        },
        bedrooms: 1,
        bathrooms: 1,
        area: 35,
        yearBuilt: 2021,
        features: ['Furnished', 'WiFi', 'Kitchenette'],
        amenities: ['internet', 'security', 'furnished'],
        images: [
            { url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800', caption: 'Studio Interior', isPrimary: true }
        ],
        status: 'active',
        isPremium: false
    },
    {
        title: 'Prime Land - Development Opportunity',
        description: '2,000 sqm plot in rapidly developing area. Perfect for residential or commercial development. All utilities available.',
        price: 120000,
        currency: 'USD',
        listingType: 'sale',
        propertyType: 'land',
        address: 'Route de Matadi, Ngaliema',
        city: 'Kinshasa',
        province: 'Kinshasa',
        country: 'Democratic Republic of Congo',
        zipCode: '00000',
        coordinates: {
            lat: -4.4000,
            lng: 15.2500
        },
        bedrooms: 0,
        bathrooms: 0,
        area: 2000,
        yearBuilt: null,
        features: ['Road Access', 'Electricity Available', 'Water Available'],
        amenities: ['power_backup', 'water'],
        images: [
            { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', caption: 'Land Plot', isPrimary: true }
        ],
        status: 'active',
        isPremium: false
    },
    {
        title: 'Beachfront Villa - Banana Beach',
        description: 'Exclusive beachfront property on Banana Beach. 6 bedrooms, infinity pool, private beach access. Ultimate luxury living.',
        price: 890000,
        currency: 'USD',
        listingType: 'sale',
        propertyType: 'villa',
        address: 'Banana Beach Road',
        city: 'Muanda',
        province: 'Kongo Central',
        country: 'Democratic Republic of Congo',
        zipCode: '00000',
        coordinates: {
            lat: -5.9300,
            lng: 12.3500
        },
        bedrooms: 6,
        bathrooms: 5,
        area: 600,
        yearBuilt: 2022,
        features: ['Beach Access', 'Infinity Pool', 'Ocean View', 'Solar System', 'Generator'],
        amenities: ['pool', 'beach', 'security', 'garden', 'power_backup', 'water'],
        images: [
            { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', caption: 'Villa Exterior', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', caption: 'Pool Area' },
            { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Beach View' }
        ],
        status: 'active',
        isPremium: true,
        premiumExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'Modern Office Building - Full Floor',
        description: 'Entire floor in Grade A office building. 500 sqm open plan office with meeting rooms. Prime location in business district.',
        price: 8000,
        currency: 'USD',
        listingType: 'rent',
        propertyType: 'commercial',
        address: '1 Boulevard du 30 Juin',
        city: 'Kinshasa',
        province: 'Kinshasa',
        country: 'Democratic Republic of Congo',
        zipCode: '00000',
        coordinates: {
            lat: -4.3250,
            lng: 15.3140
        },
        bedrooms: 0,
        bathrooms: 4,
        area: 500,
        yearBuilt: 2021,
        features: ['Modern Design', '24/7 Security', 'Elevator', 'AC', 'Parking', 'Backup Power'],
        amenities: ['parking', 'security', 'elevator', 'internet', 'power_backup', 'ac'],
        images: [
            { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', caption: 'Building Exterior', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', caption: 'Office Interior' }
        ],
        status: 'active',
        isPremium: true,
        premiumExpiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
    }
];

async function seedDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('\n🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Property.deleteMany({});
        console.log('✅ Database cleared');

        // Create users
        console.log('\n👥 Creating users...');
        const createdUsers = [];
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
            console.log(`✅ Created ${user.role}: ${user.email}`);
        }

        // Assign properties to agents
        console.log('\n🏠 Creating properties...');
        const agent1 = createdUsers.find(u => u.email === 'agent@kinshasa-realty.com');
        const agent2 = createdUsers.find(u => u.email === 'contact@lubumbashi-homes.com');

        for (let i = 0; i < properties.length; i++) {
            const propertyData = properties[i];
            // Assign properties alternately to agents
            const owner = i % 2 === 0 ? agent1 : agent2;
            propertyData.owner = owner._id;

            const property = new Property(propertyData);
            await property.save();

            // Add property to user's properties array
            await User.findByIdAndUpdate(owner._id, {
                $push: { properties: property._id }
            });

            console.log(`✅ Created property: ${property.title} (Owner: ${owner.agencyName})`);
        }

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Users created: ${createdUsers.length}`);
        console.log(`   - Properties created: ${properties.length}`);
        console.log('\n🔑 Login credentials:');
        console.log('   Admin: admin@futelatosomba.com / Admin@123');
        console.log('   Agent 1: agent@kinshasa-realty.com / Agent@123');
        console.log('   Agent 2: contact@lubumbashi-homes.com / Agent@123');
        console.log('   User: john@example.com / User@123');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n👋 Database connection closed');
        process.exit(0);
    }
}

// Run the seeding function
seedDatabase();
