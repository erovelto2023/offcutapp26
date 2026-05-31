import User from "@/models/User";
import { hashPassword } from "@/lib/auth";

export async function seedAdmin() {
  try {
    const adminUsername = "admin";
    const existingAdmin = await User.findOne({ username: adminUsername });

    if (!existingAdmin) {
      console.log("No administrator user detected. Seeding 'admin' account...");
      const hashedPassword = await hashPassword("password");

      await User.create({
        username: adminUsername,
        password: hashedPassword,
        role: "admin",
        name: "Site Administrator",
        bio: "Global platform administration manager.",
        theme: "midnight",
      });

      console.log("Successfully seeded 'admin' account with password 'password'.");
    }
  } catch (err) {
    console.error("Failed to seed administrator user:", err);
  }
}
