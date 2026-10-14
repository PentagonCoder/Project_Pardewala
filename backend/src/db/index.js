// import mongoose from 'mongoose';

// const connectDB = async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}`);
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//     throw error;
//   }
// }

// export default connectDB;

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // If you are using local PostgreSQL, you can also write it like this:
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT || 5432,
});

pool.on("connect", () => {
  console.log("PostgreSQL connected successfully");
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error", err);
  process.exit(-1);
});

export default pool;