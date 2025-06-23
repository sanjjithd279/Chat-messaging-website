import Class from "../models/class.model.js";
import User from "../models/user.model.js";

export const createClass = async (req, res) => {
  try {
    const { name, code, description, instructor } = req.body;
    const createdBy = req.user._id;

    if (!name || !code || !instructor) {
      return res
        .status(400)
        .json({ message: "Name, code, and instructor are required" });
    }

    // Check if class code already exists
    const existingClass = await Class.findOne({ code });
    if (existingClass) {
      return res.status(400).json({ message: "Class code already exists" });
    }

    const newClass = new Class({
      name,
      code,
      description,
      instructor,
      createdBy,
      students: [createdBy], // Creator is automatically added as a student
    });

    await newClass.save();

    // Update user's classes field
    await User.findByIdAndUpdate(createdBy, {
      $addToSet: { classes: newClass._id },
    });

    // Populate students with user details
    await newClass.populate("students", "fullName email profilePic");

    res.status(201).json(newClass);
  } catch (error) {
    console.log("Error in createClass controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const joinClass = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    if (!code) {
      return res.status(400).json({ message: "Class code is required" });
    }

    const classToJoin = await Class.findOne({ code });
    if (!classToJoin) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if user is already in the class
    if (classToJoin.students.includes(userId)) {
      return res
        .status(400)
        .json({ message: "You are already enrolled in this class" });
    }

    classToJoin.students.push(userId);
    await classToJoin.save();

    // Update user's classes field
    await User.findByIdAndUpdate(userId, {
      $addToSet: { classes: classToJoin._id },
    });

    // Populate students with user details
    await classToJoin.populate("students", "fullName email profilePic");

    res.status(200).json(classToJoin);
  } catch (error) {
    console.log("Error in joinClass controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserClasses = async (req, res) => {
  try {
    const userId = req.user._id;

    const classes = await Class.find({ students: userId })
      .populate("students", "fullName email profilePic")
      .populate("createdBy", "fullName email profilePic");

    res.status(200).json(classes);
  } catch (error) {
    console.log("Error in getUserClasses controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;
    const userId = req.user._id;

    const classData = await Class.findById(classId).populate(
      "students",
      "fullName email profilePic"
    );

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if user is enrolled in this class
    if (
      !classData.students.some(
        (student) => student._id.toString() === userId.toString()
      )
    ) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this class" });
    }

    // Filter out the current user from the students list
    const otherStudents = classData.students.filter(
      (student) => student._id.toString() !== userId.toString()
    );

    res.status(200).json(otherStudents);
  } catch (error) {
    console.log("Error in getClassStudents controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
