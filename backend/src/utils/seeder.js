const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Load models
const User = require('../models/User');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data - Users
const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'user',
    contact: '555-123-4567',
    address: '123 Main St, Anytown, USA'
  },
  {
    name: 'Happy Paws Shelter',
    email: 'info@happypaws.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'shelter',
    contact: '555-987-6543',
    address: '456 Shelter Ave, Petsville, USA'
  },
  {
    name: 'Admin User',
    email: 'admin@petadoption.com',
    password: bcrypt.hashSync('adminpass123', 10),
    role: 'admin',
    contact: '555-789-0123',
    address: '789 Admin Blvd, Control City, USA'
  }
];

// Sample data - Pets (will be populated with shelterIds after users are created)
const generatePets = (shelterId) => [
  {
    name: 'Max',
    breed: 'Golden Retriever',
    age: '3 years',
    gender: 'Male',
    description: 'Friendly and energetic dog who loves to play fetch.',
    image: 'https://example.com/images/max.jpg',
    category: 'dog',
    size: 'Large',
    adoptionStatus: 'Available',
    shelter: shelterId
  },
  {
    name: 'Luna',
    breed: 'Siamese',
    age: '2 years',
    gender: 'Female',
    description: 'Sweet and gentle cat who loves to cuddle.',
    image: 'https://example.com/images/luna.jpg',
    category: 'cat',
    size: 'Medium',
    adoptionStatus: 'Available',
    shelter: shelterId
  },
  {
    name: 'Rocky',
    breed: 'German Shepherd',
    age: '5 years',
    gender: 'Male',
    description: 'Loyal and protective dog, good with families.',
    image: 'https://example.com/images/rocky.jpg',
    category: 'dog',
    size: 'Large',
    adoptionStatus: 'Available',
    shelter: shelterId
  }
];

// Import data into DB
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Pet.deleteMany();
    await Adoption.deleteMany();
    
    console.log('Data cleared from database...');
    
    // Create users
    const createdUsers = await User.insertMany(sampleUsers);
    console.log('Users imported...');
    
    // Find the shelter user
    const shelter = createdUsers.find(user => user.role === 'shelter');
    
    // Create pets with the shelter's ID
    const petsWithShelterId = generatePets(shelter._id);
    const createdPets = await Pet.insertMany(petsWithShelterId);
    console.log('Pets imported...');
    
    // Create a sample adoption
    const regularUser = createdUsers.find(user => user.role === 'user');
    const pet = createdPets[0]; // First pet
    
    await Adoption.create({
      pet: pet._id,
      user: regularUser._id,
      status: 'Pending',
      applicationDate: new Date(),
      notes: 'Sample adoption application'
    });
    console.log('Sample adoption created...');
    
    console.log('Data import complete!');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// Delete all data from DB
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Pet.deleteMany();
    await Adoption.deleteMany();
    
    console.log('All data deleted from database...');
    process.exit();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

// Process command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use correct command: node seeder -i (import) or -d (delete)');
  process.exit();
} 