const mongoose = require("mongoose");

const connectDB = async () => {
    const MONGODB_URL = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!MONGODB_URL) {
        console.error("Error: MONGODB_URI is not defined in .env file");
        process.exit(1);
    }
    try {
        const conn = await mongoose.connect(MONGODB_URL);
        // console.log(`MongoDB Connected: ${conn.connection.host}`);
         console.log(`MongoDB Connected `);
    } catch (error) {
        console.error("Error While Connecting Database --->", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
