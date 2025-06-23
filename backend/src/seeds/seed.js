import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Class from "../models/class.model.js";

// Go up one level to find the .env file in the backend root
dotenv.config({ path: "./.env" });

const seedClassesData = [
  {
    name: "Intro to Computer Science",
    code: "CS 1000",
    description: "A foundational course in computer science.",
    instructor: "Dr. Alan Turing",
  },
  {
    name: "University Physics I",
    code: "PHYS 2200",
    description: "An introduction to classical mechanics.",
    instructor: "Dr. Isaac Newton",
  },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in your .env file");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully.");

    // 1. Get all users
    const users = await User.find({});
    if (users.length === 0) {
      console.log(
        "No users found. Please create at least one user before seeding."
      );
      return;
    }
    const creatorId = users[0]._id; // Assign the first user as the creator

    // 2. Clear all existing class assignments from all users to ensure a clean slate
    console.log("Resetting all user class assignments...");
    await User.updateMany({}, { $set: { classes: [] } });

    // 3. Ensure classes exist (create if they don't) and clear their student lists
    for (const classInfo of seedClassesData) {
      await Class.updateOne(
        { code: classInfo.code },
        {
          $set: { students: [] },
          $setOnInsert: { ...classInfo, createdBy: creatorId },
        },
        { upsert: true }
      );
    }
    console.log("Cleared student lists from target classes.");

    // 4. Split users into two groups
    const halfwayIndex = Math.ceil(users.length / 2);
    const firstHalfUsers = users.slice(0, halfwayIndex);
    const secondHalfUsers = users.slice(halfwayIndex);
    const firstHalfUserIds = firstHalfUsers.map((user) => user._id);
    const secondHalfUserIds = secondHalfUsers.map((user) => user._id);

    // 5. Assign first half to CS 1000
    const csClass = await Class.findOne({ code: "CS 1000" });
    if (csClass && firstHalfUserIds.length > 0) {
      csClass.students = firstHalfUserIds;
      await csClass.save();
      await User.updateMany(
        { _id: { $in: firstHalfUserIds } },
        { $addToSet: { classes: csClass._id } }
      );
      console.log(
        `Enrolled ${firstHalfUserIds.length} users in "${csClass.name}".`
      );
    }

    // 6. Assign second half to PHYS 2200
    const physClass = await Class.findOne({ code: "PHYS 2200" });
    if (physClass && secondHalfUserIds.length > 0) {
      physClass.students = secondHalfUserIds;
      await physClass.save();
      await User.updateMany(
        { _id: { $in: secondHalfUserIds } },
        { $addToSet: { classes: physClass._id } }
      );
      console.log(
        `Enrolled ${secondHalfUserIds.length} users in "${physClass.name}".`
      );
    }

    console.log("Database re-seeding and assignment completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
  }
};

seedDatabase();
