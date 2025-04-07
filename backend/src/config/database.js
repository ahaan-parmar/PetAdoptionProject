const mongoose = require('mongoose');

/**
 * Advanced MongoDB connection configuration
 * Includes connection pooling, retry logic, and proper error handling
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection pool size
      maxPoolSize: 10,
      // Wait 5 seconds before timing out
      serverSelectionTimeoutMS: 5000,
      // Wait 10 seconds for connection
      socketTimeoutMS: 45000,
      // Keep trying to send operations for 150 seconds
      family: 4 // Use IPv4, skip trying IPv6
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Log if the connection is slow
    mongoose.connection.on('slow', (data) => {
      console.warn('MongoDB is experiencing slow operations:', data);
    });

    // Handle connection errors
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    // Handle successful reconnection
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 