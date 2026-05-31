const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = "mongodb://127.0.0.1:27017/offcut-links";

async function run() {
  try {
    console.log("Connecting to MongoDB:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    // Simple schema to interact with the users collection
    const UserSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: "member" },
      name: String,
      bio: String,
      theme: String,
    }, { collection: "users" });

    // Use existing model or compile one
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const adminUsername = "admin";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password", salt);

    const existingAdmin = await User.findOne({ username: adminUsername });

    if (existingAdmin) {
      console.log("Admin user already exists! Force updating password and role...");
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "admin";
      if (!existingAdmin.name) existingAdmin.name = "Site Administrator";
      await existingAdmin.save();
      console.log("Successfully updated admin user password to 'password' and role to 'admin'!");
    } else {
      console.log("Admin user does not exist. Creating new admin user...");
      await User.create({
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
        name: "Site Administrator",
        bio: "Global platform administration manager.",
        theme: "midnight",
      });
      console.log("Successfully created admin user with username 'admin' and password 'password'!");
    }

    // Check if the migration is complete by showing all users
    const allUsers = await User.find({});
    console.log("Current users in database:", allUsers.map(u => ({ username: u.username, role: u.role })));

  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

run();
