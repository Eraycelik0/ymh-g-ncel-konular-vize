require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const hashedPassword = await bcrypt.hash("testPassword", 10);
        await User.create({
            name: "Test User",
            email: "test@example.com",
            password: hashedPassword
        });
        console.log("Test user created!");
        process.exit();
    } catch (error) {
        console.error("Error creating test user:", error);
        process.exit(1);
    }
})();
