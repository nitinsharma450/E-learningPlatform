import adminProfile from "../../Schema/Adminprofile.js";
import Teacher from "../../Schema/Teacher.js";
import fs from "fs";
import { ServerConfigs } from "../configs/ServerConfigs.js";
import Course from "../../Schema/Course.js";
import path from "path";
import { studentProfile } from "../../Schema/studentProfile.js";
import { io } from "../../index.js";
import Rating from "../../Schema/rating.js";

export class adminController {
  static async teacherCreate(req, res) {
    const teacherData = req.body;
    console.log("Incoming teacher data:", teacherData);

    try {
      const newTeacher = await Teacher.create(teacherData);
      res.json({
        message: "Teacher created successfully",
        status: 200,
      });
    } catch (error) {
      console.error("Error creating teacher:", error);
      res.status(500).json({
        message: error.message,
        status: 500,
      });
    }
  }

  static async teacherCount(req, res) {
    try {
      let count = await Teacher.countDocuments();
      if (count > 0) {
        res.send({ message: "success", status: 200, data: count });
      }
    } catch (error) {
      res.status(500).send({ message: error.message, status: 500 });
    }
  }

  static async searchActiveTeachersCount(req, res) {
    try {
      let count = await Teacher.countDocuments({ isActive: true });
      return res.status(200).send({ message: "success", data: count });
    } catch (error) {
      console.log({ error: error.message });
      return res.status(500).send({ message: error.message });
    }
  }
  static async searchActiveTeacherProfile(req, res) {
    try {
      const profile = await Teacher.find({ isActive: true });

      return res.status(200).send({
        message: "success",
        data: profile,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({
        message: "internal server error",
      });
    }
  }

  static async adminCredentialSave(req, res) {
    try {
      const details = req.body;

      if (!details || !details.email || !details.displayName) {
        return res.status(400).json({ message: "Name and Email are required" });
      }

      const existingAdmin = await adminProfile.findOne({
        email: details.email,
      });
      if (existingAdmin) {
        return res.status(200).json({ message: "Email already exists" });
      }

      const adminData = {
        name: details.displayName,
        email: details.email,
        role: "admin",
        profilePicture: details.profilePicture || "",
      };

      const response = await adminProfile.create(adminData);

      res.status(200).json({ message: "Success", data: response });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async searchProfile(req, res) {
    try {
      let email = req.body;
      console.log("email is ", email);

      let data = await adminProfile.find(email);
      if (data) {
        res.status(200).send({ message: "success", data });
      }
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  static async searchTeacher(req, res) {
    try {
      const response = await Teacher.find();

      if (response.length > 0) {
        res.status(200).send({ message: "success", data: response });
      } else {
        res.status(404).send({ message: "No teachers found" });
      }
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  static async courseCreate(req, res) {
    try {
      if (!fs.existsSync("public/course")) {
        fs.mkdirSync("public/course", { recursive: true });
      }

      if (!req.files || !req.files.thumbnail) {
        return res.status(400).json({ message: "Image is required" });
      }

      const image = req.files.thumbnail;
      const fileName = Date.now() + path.extname(image.name);
      const filePath = path.join(
        ServerConfigs.PublicFolder,
        "course",
        fileName
      );

      image.mv(filePath, async (err) => {
        if (err) {
          console.error("Upload error:", err);
          return res.status(500).json({ message: "Failed to upload image" });
        }

        const imageUrl = `/course/${fileName}`;
        const body = req.body;

        let tagsValue = body.tags;
        if (typeof tagsValue === "string") {
          try {
            tagsValue = JSON.parse(tagsValue);
          } catch {
            tagsValue = JSON.stringify(
              tagsValue.split(",").map((tag) => tag.trim())
            );
          }
        }

        console.log(body);
        const newCourse = {
          title: body.title,
          description: body.description,
          category: body.category,
          level: body.level,
          duration: body.duration,
          thumbnail: imageUrl,
        };
        let response = await Course.create(newCourse);
        return res
          .status(200)
          .send({ message: "success", status: 200, data: response });
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  }

  static async search(req, res) {
    try {
      let response = await Course.find();

      response = response.map((course) => {
        const c = course.toObject(); // convert to plain object
        c.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.thumbnail}`;
        return c;
      });

      if (response.length > 0) {
        return res.status(200).send({ message: "success", data: response });
      } else {
        return res.status(404).send({ message: "No courses found" });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async filter(req, res) {
    try {
      const keyword = req.body;
      console.log(keyword);

      // Validate input
      if (!keyword) {
        return res.status(400).send({ message: "Keyword is required" });
      }
      let key = keyword.key;

      const response = await Course.find({
        $or: [
          { title: { $regex: key, $options: "i" } }, // Like on title
          { description: { $regex: key, $options: "i" } },
          { category: { $regex: key, $options: "i" } },
          { level: { $regex: key, $options: "i" } },
        ],
      });

      if (response.length > 0) {
        response = response.map((course) => {
          const c = course.toObject(); // convert to plain object
          c.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.thumbnail}`;
          return c;
        });
        return res
          .status(200)
          .send({ message: "success", status: 200, data: response });
      } else {
        return res.status(200).send({ message: "No courses found", data: [] });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async countCoures(req, res) {
    try {
      let count = await Course.countDocuments();
      if (count > 0) {
        return res.status(200).send({ message: "success", data: count });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async countStudent(req, res) {
    try {
      let count = await studentProfile.countDocuments();
      if (count > 0) {
        res.status(200).send({ message: "success", data: count });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async searchActiveStudents(req, res) {
    try {
      const count = await studentProfile.countDocuments({ isActive: true });
      return res.status(200).send({
        message: "success",
        data: count,
        status: 200,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
  static async searchSubjectTitle(req, res) {
    try {
      console.log("coming");
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

  static async searchAllStudent(req, res) {
    try {
      let response = await studentProfile.find();
      if (response.length > 0) {
        return res.status(200).send({ message: "success", data: response });
      } else {
        return res.status(200).send({ message: "success", data: [] });
      }
    } catch (error) {
      return res.send(500).send(error.message);
    }
  }

  static async activeStudentProfile(req, res) {
    try {
      let profile = await studentProfile.find({ isActive: true });
      return res.status(200).send({ message: "success", data: profile });
    } catch (error) {
      console.log({ error: error.message });
      return res.status(500).send({ message: error.message });
    }
  }

  static async blockUnblockTeacher(req, res) {
    try {
      const { teacherId } = req.body;

      if (!teacherId) {
        return res.status(400).send({ message: "teacherId is required" });
      }
      let detailsTeacher = await Teacher.findOne({ _id: teacherId });
      if (detailsTeacher.isBlocked) {
        let response = await Teacher.findByIdAndUpdate(teacherId, {
          $set: { isBlocked: false },
        });
        return res.status(200).send({
          message: "Teacher unblocked successfully",
          data: response,
          status: 200,
        });
      }

      const updatedTeacher = await Teacher.findByIdAndUpdate(
        teacherId,
        { $set: { isBlocked: true, isActive: false } }, // force offline
        { new: true }
      );

      if (!updatedTeacher) {
        return res.status(404).send({ message: "Teacher not found" });
      }

      //  notify dashboard in real time
      io.emit("userStatusChange");

      return res.status(200).send({
        message: "Teacher blocked successfully",
        data: updatedTeacher,
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  static async blockUnblockStudent(req, res) {
    try {
      const { studentId } = req.body;

      if (!studentId) {
        return res.status(400).send({ message: "studentId is required" });
      }
      let detailsStudent = await studentProfile.findOne({ _id: studentId });
      if (detailsStudent.isBlocked) {
        let response = await studentProfile.findByIdAndUpdate(studentId, {
          $set: { isBlocked: false },
        });
        return res.status(200).send({
          message: "Teacher unblocked successfully",
          data: response,
          status: 200,
        });
      }

      const updatedStudent = await studentProfile.findByIdAndUpdate(
        studentId,
        { $set: { isBlocked: true, isActive: false } }, // force offline
        { new: true }
      );

      if (!updatedStudent) {
        return res.status(404).send({ message: "Student not found" });
      }

      //  notify dashboard in real time
      io.emit("userStatusChange");

      return res.status(200).send({
        message: "Student blocked successfully",
        data: updatedStudent,
        status: 200,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: "internal server error" });
    }
  }

  static async getTeacherById(req, res) {
    try {
      let { teacherId } = req.body;

      let response = await Teacher.find({ _id: teacherId });

      if (response) {
        return res.status(200).send({ message: "success", data: response });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  }

  static async updateTeacher(req, res) {
    try {
      let teacherForm = req.body;

      console.log(teacherForm);
      if (teacherForm) {
        let response = await Teacher.findByIdAndUpdate(teacherForm.teacherId, {
          $set: {
            name: teacherForm.name,
            username: teacherForm.username,
            subject: teacherForm.subject,
          },
        });
        if (response) {
          return res
            .status(200)
            .send({ message: "Teacher updated successfully", status: 200 });
        } else {
          return res
            .status(400)
            .send({ message: "error in updating teacher", status: 400 });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  }

 static async getTopRatedCourse(req, res) {
  try {
    let ratedCourse = await Course.find({ rating: { $gte: 4 } });

    if (ratedCourse.length === 0) {
      return res.status(404).send({ message: "No top-rated courses found" });
    }

    ratedCourse = ratedCourse.map((course) => {
      course.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${course.thumbnail}`;
      return course;
    });

    return res.status(200).send({ message: "success", data: ratedCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
}

  static async getRecentRatings(req, res) {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

      const recentRatings = await Rating.find({
        time: { $gte: tenMinutesAgo },
      });

      if (recentRatings) {
        return res
          .status(200)
          .send({ message: "success", data: recentRatings });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error });
    }
  }
}
