import Teacher from "../../Schema/Teacher.js";
import jwt from "jsonwebtoken";
import { SecretConfigs } from "../configs/SecretConfigs.js";
import fs from "fs";
import path from "path";
import Course from "../../Schema/Course.js";
import { ServerConfigs } from "../configs/ServerConfigs.js";
import { CourseContent } from "../../Schema/CourseContent.js";
import { title } from "process";
import { EnrollCourse } from "../../Schema/EnrollCourse.js";
import { studentProfile } from "../../Schema/studentProfile.js";
import { io } from "../../index.js";

export class teacherController {
  static async login(req, res) {
    try {
      let loginForm = req.body;
      console.log("loginform is ", loginForm);
      loginForm.username = loginForm.username.toLowerCase();



      let details = await Teacher.findOne({ username: loginForm.username });
      console.log(details);
      if (details) {
       
        if(details.isBlocked){
    return res.status(403).send({message:"Your account has been blocked. Please contact the administrator.",status:403})
        }


        if (
          details.password == loginForm.password &&
          details.subject == loginForm.subject
        ) {
          console.log("hello");
          let token = jwt.sign(
            {
              username: details.username,
              name: details.name,
              subject: details.subject,
            },
            SecretConfigs.JWT_SECRET_KEY,
            { expiresIn: "3h" }
          );
           let response=await Teacher.findOneAndUpdate(
            { username: loginForm.username },
            { $set: { isActive: true, lastLogin: new Date() } }
          );

          io.emit("userStatusChange");
          res
            .status(200)
            .send({ message: "success", status: 200, token, data: response });
        } else {
          res.status(401).send({ message: "invalid credentials", status: 401 });
        }
      } else {
        res.status(401).send({ message: "invalid credentials", status: 401 });
      }
    } catch (error) {
      res.status(500).send({ message: "internal server error", status: 500 });
    }
  }
  static async courseContent(req, res) {
    try {
      // Ensure folder exists
      const uploadDir = path.join(ServerConfigs.PublicFolder, "course");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Check file existence
      if (!req.files || !req.files.file) {
        return res.status(400).json({ message: "File is required" });
      }

      const file = req.files.file;
      const ext = path.extname(file.name).toLowerCase();
      const timestamp = Date.now();
      const fileName = `${timestamp}${ext}`;

      // Determine file type folder
      let fileType = "others";
      if ([".png", ".jpg", ".jpeg", ".webp"].includes(ext)) fileType = "images";
      else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext))
        fileType = "videos";
      else if ([".pdf", ".docx", ".pptx"].includes(ext)) fileType = "pdfs";

      const typeFolder = path.join(uploadDir, fileType);
      if (!fs.existsSync(typeFolder))
        fs.mkdirSync(typeFolder, { recursive: true });

      // Final path
      const filePath = path.join(typeFolder, fileName);

      // Move file to folder
      file.mv(filePath, async (err) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ message: "Failed to upload file" });
        }

        // Relative URL for serving in frontend
        const fileUrl = `/course/${fileType}/${fileName}`;
        const body = req.body;

        // Save course info
        const newCourse = {
          title: body.title,
          description: body.description,

          contentUrl: fileUrl,
          contentType: body.contentType,
        };

        const response = await CourseContent.create(newCourse);
        return res.status(200).json({
          message: "success",
          status: 200,
          data: response,
        });
      });
    } catch (error) {
      console.error("Server error:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async searchAllTitle(req, res) {
    try {
      let courses = await Course.find();
      let title = [];
      if (courses) {
        courses.map((course) => {
          title.push(course.title);
        });
      }
      return res
        .status(200)
        .send({ message: "success", status: 200, data: title });
    } catch (error) {
      console.error("Server error:", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }
  static async countCourseContent(req, res) {
    try {
      const { subject } = req.body;
      console.log(subject);

      if (!subject) {
        return res.status(400).send({ message: "Title is required" });
      }

      // Correct method name and logic
      const count = await CourseContent.countDocuments({ title: subject });

      return res.status(200).send({ message: "success", data: count });
    } catch (error) {
      console.error("Count course content error:", error);
      return res
        .status(500)
        .send({ message: "Internal server error", error: error.message });
    }
  }
  static async searchProfile(req, res) {
    try {
      const { user_id } = req.body;
      console.log(user_id);
      let _id = user_id;

      if (!user_id) {
        return res.status(400).send({ message: "user_id is required" });
      }

      const response = await Teacher.findOne({ _id }); // use findOne for a single profile

      if (!response) {
        return res.status(404).send({ message: "Profile not found" });
      }

      return res.status(200).send({ message: "success", data: response });
    } catch (error) {
      console.error("Error in searchprofile:", error);
      return res.status(500).send({ message: error.message });
    }
  }

  static async searchEnrollStudent(req, res) {
    try {
      let title = req.body;
      console.log(title);

      if (title) {
        let course = { courseTitle: title.subject };
        let count = await EnrollCourse.countDocuments(course);

        if (count > 0) {
          return res.status(200).send({ message: "success", data: count });
        } else {
          return res.status(200).send({ message: "suucess", data: 0 });
        }
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async searchActiveStudent(req, res) {
    try {
      // Step 1: Find all active enrollments
      const enrollments = await EnrollCourse.find({ isActive: true });

      // Step 2: If no active enrollments
      if (enrollments.length === 0) {
        return res
          .status(200)
          .send({ message: "No active student profiles found" });
      }

      // Step 3: Get all unique user IDs
      const userIds = enrollments.map((enroll) => enroll.user_id);

      // Step 4: Fetch all student profiles matching those IDs
      const studentProfiles = await studentProfile.find({
        userId: { $in: userIds },
      });

      // Step 5: Send response
      return res.status(200).send({
        message: "success",
        data: studentProfiles,
      });
    } catch (error) {
      console.error("Search active student error:", error);
      return res.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

 static async logout(req, res) {
  try {
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).send({ message: "teacherId is required" });
    }

    const response = await Teacher.findOneAndUpdate(
      { _id: teacherId },
      { $set: { isActive: false } },
      { new: true } // return updated document
    );

    if (!response) {
      return res.status(404).send({ message: "Teacher not found" });
    }

    // 🔔 real-time update
    io.emit("userStatusChange");

    return res.status(200).send({
      message: "logout success",
      data: response
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "internal server error" });
  }
}

}
