import mongoose from 'mongoose';

/**
 * Connect to MongoDB Atlas using Mongoose.
 * Reads the connection URI from process.env.MONGODB_URI (with fallback to MONGO_URI).
 * Excludes sensitive credentials from all console logs.
 */
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!uri) {
    const errorMsg = 'Database configuration error: MONGODB_URI environment variable is not defined.';
    console.error(`[Database Error] ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`[Database] MongoDB Atlas connected successfully (Host: ${conn.connection.host})`);
    return conn;
  } catch (error) {
    // Sanitized logging: do not print URI or credentials
    console.error(`[Database Error] Connection failed: ${error.message}`);
    throw error;
  }
};
