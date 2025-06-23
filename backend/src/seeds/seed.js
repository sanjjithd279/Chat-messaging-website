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

    // get all users
    const users = await User.find({});
    if (users.length === 0) {
      console.log("no users found. make a user first before seeding.");
      return;
    }
    const creatorId = users[0]._id; // first user is creator

    // clear all user class assignments
    console.log("resetting all user class assignments...");
    await User.updateMany({}, { $set: { classes: [] } });

    // make sure classes exist, clear their students
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
    console.log("cleared student lists from target classes.");

    // split users into 2 groups
    const halfwayIndex = Math.ceil(users.length / 2);
    const firstHalfUsers = users.slice(0, halfwayIndex);
    const secondHalfUsers = users.slice(halfwayIndex);
    const firstHalfUserIds = firstHalfUsers.map((user) => user._id);
    const secondHalfUserIds = secondHalfUsers.map((user) => user._id);

    // assign first half to cs 1000
    const csClass = await Class.findOne({ code: "CS 1000" });
    if (csClass && firstHalfUserIds.length > 0) {
      csClass.students = firstHalfUserIds;
      await csClass.save();
      await User.updateMany(
        { _id: { $in: firstHalfUserIds } },
        { $addToSet: { classes: csClass._id } }
      );
      console.log(
        `enrolled ${firstHalfUserIds.length} users in "${csClass.name}".`
      );
    }

    // assign second half to phys 2200
    const physClass = await Class.findOne({ code: "PHYS 2200" });
    if (physClass && secondHalfUserIds.length > 0) {
      physClass.students = secondHalfUserIds;
      await physClass.save();
      await User.updateMany(
        { _id: { $in: secondHalfUserIds } },
        { $addToSet: { classes: physClass._id } }
      );
      console.log(
        `enrolled ${secondHalfUserIds.length} users in "${physClass.name}".`
      );
    }

    console.log("db re-seed and assignment done!");
  } catch (error) {
    console.error("err seeding db:", error);
  } finally {
    await mongoose.disconnect();
    console.log("mongodb disconnected.");
  }
};

seedDatabase();
