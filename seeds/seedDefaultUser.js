const bcrypt = require("bcrypt");
const userRepository = require("../repository/userRepository");

async function seedDefaultUser() {
  try {
    const adminExist = await userRepository.FindByEmail("admin@gmail.com");
    const teacherExist = await userRepository.FindByEmail("teacher@gmail.com");
    const studentExist = await userRepository.FindByEmail("student@gmail.com");

    if (!adminExist) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await userRepository.CreateUser(
        "admin@gmail.com",
        hashedPassword,
        "Admin User",
        "admin"
      );
    }

    if (!teacherExist) {
      const hashedPassword = await bcrypt.hash("teacher123", 10);
      await userRepository.CreateUser(
        "teacher@gmail.com",
        hashedPassword,
        "Teacher User",
        "teacher"
      );
    }

    if (!studentExist) {
      const hashedPassword = await bcrypt.hash("student123", 10);
      await userRepository.CreateUser(
        "student@gmail.com",
        hashedPassword,
        "Student User",
        "student"
      );
    }

    console.log("Default users seeded successfully!");
  } catch (error) {
    console.log("Error: " + error);
  }
}

module.exports = seedDefaultUser;
