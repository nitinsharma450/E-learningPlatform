import { io } from "../../index.js";
import Course from "../../Schema/Course.js";
import { CourseContent } from "../../Schema/CourseContent.js";

import { EnrollCourse } from "../../Schema/EnrollCourse.js";
import { studentProfile } from "../../Schema/studentProfile.js";
import { ServerConfigs } from "../configs/ServerConfigs.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Rating from "../../Schema/rating.js";
dotenv.config();
export class studentController {
  static async searchAll(req, res) {
    try {
      let courses = await Course.find();

      courses = courses.map((course) => {
        const c = course.toObject(); // convert to plain object
        c.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.thumbnail}`;
        return c;
      });

      if (courses.length > 0) {
        return res.status(200).send({ message: "success", data: courses });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async filter(req, res) {
    try {
      let filterKey = req.body;
      console.log(filterKey);
      if (!filterKey) {
        return res.status(500).send({ message: "filter Key is required" });
      }
      let key = filterKey.key;

      let response = await Course.aggregate([
        {
          $match: {
            $or: [
              { title: { $regex: key, $options: "i" } },

              { category: { $regex: key, $options: "i" } },
              { level: { $regex: key, $options: "i" } },
            ],
          },
        },
      ]);

      response = response.map((course) => {
        course.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${course.thumbnail}`;
        return course;
      });

      if (response.length > 0) {
        return res.status(200).send({ message: "success", data: response });
      } else {
        return res
          .status(200)
          .send({ message: "No matching courses found", data: [] });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async saveCredentials(req, res) {
    try {
      const details = req.body;

      // ✅ Validate input
      if (!details || !details.email || !details.displayName) {
        return res.status(400).json({ message: "Name and Email are required" });
      }

      const existingAdmin = await studentProfile.findOne({
        email: details.email,
      });
      if (existingAdmin) {
        let response = await studentProfile.findOneAndUpdate(
          { email: details.email },
          { $set: { isActive: true, lastLogin: new Date() } }
        );
        io.emit("userStatusChange", {
          userId: response.userId,
          isActive: true,
        });
        return res.status(200).json({
          message: "Email already exists",
          status: 200,
          data: response,
        });
      }

      const studentData = {
        userId: details.uid,
        name: details.displayName,
        email: details.email,
        role: "student",
        profilePicture: details.profilePicture || "",
        lastLogin: details.lastLoginAt,
        isActive: true,
      };

      const response = await studentProfile.create(studentData);
      io.emit("userStatusChange", { userId: response.userId, isActive: true });

      return res
        .status(200)
        .json({ message: "Success", data: response, status: 200 });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async searchProfile(req, res) {
    try {
      let { email } = req.body;
      let response = await studentProfile.findOne({ email: email });
      if (response) {
        return res
          .status(200)
          .send({ message: "success", data: response, status: 200 });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async logout(req, res) {
    try {
      let { userId } = req.body;
      console.log(userId);

      if (userId) {
        let response = await studentProfile.findOneAndUpdate(
          { userId: userId },
          { $set: { isActive: false, lastLogin: new Date() } }
        );
        console.log(response);

        let resp = await EnrollCourse.findOneAndUpdate(
          { user_id: userId },
          { $set: { isActive: false } }
        );
        console.log(resp);

        io.emit("userStatusChange", { userId: userId, isActive: false });
        return res.send({ message: "success", status: 200 });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  static async searchCourseByTitle(req, res) {
    let { title } = req.body;

    console.log("course title is :", title);
    try {
      console.log(title);
      let course = await CourseContent.find({ title });
      if (course) {
        console.log(course);

        course = course.map((course) => {
          const c = course.toObject(); // convert to plain object
          c.contentUrl = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.contentUrl}`;
          return c;
        });

        return res
          .status(200)
          .send({ message: "success", data: course, status: 200 });
      }
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  }

  static async enroll(req, res) {
    try {
      const enrollDetails = req.body;
      console.log("Enroll details:", enrollDetails);

      const { user_id, courseTitle } = enrollDetails;

      // ✅ Validate required fields
      if (!user_id || !courseTitle) {
        return res
          .status(400)
          .send({ message: "user_id and courseTitle are required" });
      }

      // ✅ Check if user already enrolled
      const existingEnrollment = await EnrollCourse.findOne({
        user_id: user_id,
        courseTitle: courseTitle,
      });

      if (existingEnrollment) {
        // ✅ Reactivate existing enrollment
        await EnrollCourse.updateMany(
          { user_id },
          { $set: { isActive: true } }
        );

        return res.status(200).send({
          message: "Enrollment reactivated successfully",
          status: 200,
          data: existingEnrollment,
        });
      }

      enrollDetails.isActive = true;
      enrollDetails.timeOfEnroll = new Date();

      const newEnrollment = await EnrollCourse.create(enrollDetails);

      return res.status(200).send({
        message: "Enrollment created successfully",
        status: 200,
        data: newEnrollment,
      });
    } catch (error) {
      console.error("Enroll error:", error);
      return res.status(500).send({
        message: "Internal server error",
        error: error.message,
      });
    }
  }

  static async searchDoubt(req, res) {
    let { userPrompt } = req.body;
    console.log(userPrompt);
    let SYSTEM_PROMPT = `
You are a doubt solver, an expert in all subjects related to software development,
including web development, mobile app development, AI/ML, data science, Python, Java, C++, 
React, Node.js, Express, MongoDB, SQL, APIs, frameworks, and related technologies and also give some response when some greet.

Your role and behavior:
- Only answer questions related to coding, software development, frameworks, or technology tools.
- If the user asks something unrelated (like history, biology, math puzzles, geography, etc.),
  respond strictly and only with: "sorry i can't answer these ques"
- Always give clear, concise, and technically correct answers with examples when appropriate.

---

 refer these example

1) Question: "How do I connect React frontend to Node.js backend?"
   Answer: "You can use Axios or Fetch API in React to send HTTP requests to your Node.js backend routes."

2) Question: "What is the difference between var, let, and const in JavaScript?"
   Answer: "var is function-scoped, while let and const are block-scoped. const cannot be reassigned after initialization."

3) Question: "How to create a REST API in Express.js?"
   Answer: "You can use Express to define routes and controllers. Example:
   \`\`\`js
   const express = require('express');
   const app = express();
   app.get('/api', (req, res) => res.send('Hello API'));
   app.listen(3000);
   \`\`\`"

4) Question: "How can I deploy my Node.js app on Render or Vercel?"
   Answer: "Push your code to GitHub, connect your repo to Render or Vercel, and click 'Deploy'. Both platforms auto-detect Node.js apps."

5) Question: "How to implement JWT authentication in a Spring Boot app?"
   Answer: "Use Spring Security with a JWT filter that validates tokens for each request."

6) Question: "What is the difference between SQL and NoSQL databases?"
   Answer: "SQL databases store structured data in tables, while NoSQL stores unstructured or semi-structured data like JSON."

7) Question: "How do I optimize my React app for performance?"
   Answer: "Use React.memo, lazy loading, and avoid unnecessary re-renders by optimizing state management."

8) Question: "How can I create a login page with React and Node.js backend?"
   Answer: "Use a form in React to send credentials via Axios to a Node.js backend that verifies the user and returns a JWT."

9) Question: "How do I integrate ChatGPT API in my Node.js app?"
   Answer: "Install the OpenAI npm package, add your API key, and call the \`chat.completions.create\` method with your prompt."

10) Question: "How to use MongoDB with Express?"
    Answer: "Install mongoose, connect to MongoDB, define a schema, and use it for CRUD operations."


11) Question: "Who invented the light bulb?"
   Answer: "sorry i can't answer these ques"

12) Question: "What is the capital of India?"
   Answer: "sorry i can't answer these ques"

13) Question: "Explain photosynthesis."
   Answer: "sorry i can't answer these ques"

14) Question: "Who won the World Cup 2022?"
   Answer: "sorry i can't answer these ques"

15) Question: "Solve this math equation: 2x + 5 = 15"
   Answer:"sorry i can't answer these ques"


Follow these rules **strictly**.  
Never answer anything that is not related to software development, programming, or technology.
`;
    try {
      if (!userPrompt) {
        return res.status(400).send({ message: "userPrompt is required" });
      }

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });

      const prompt = `${SYSTEM_PROMPT}\nUser question: ${userPrompt}`;
      const result = await model.generateContent(prompt);

      const answer = result.response.text();
      return res.status(200).send({ message: "success", data: answer });
    } catch (error) {
      console.error("Gemini error:", error.response?.error || error);
      return res.status(500).send({ message: error.message });
    }
  }

  static async rateCourse(req, res) {
    try {
      let details = req.body;
      console.log(details);
      if (details) {
        let response = await Rating.create({
          studentId: details.studentId,
          courseId: details.courseId,
          rating: details.rating,
          time: Date.now(),
        });

        let ratings = await Rating.find({ courseId: details.courseId });

        let sum = ratings.reduce((sum, value) => {
          return sum + value.rating;
        }, 0);

        let avgRating = sum / ratings.length;
        await Course.findByIdAndUpdate(details.courseId, {
          $set: { rating: avgRating },
        });
        io.emit('courseRatingUpdated')

        if (response) {
          return res
            .status(200)
            .send({ message: "Thanks For Yours Rating ", status: 200 });
        } else {
          return res.status(402).send({ message: "some went wrong" });
        }
      }
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  static async enrolledCourses(req, res) {
  try {
    const { userId } = req.body; // or req.user.id if using JWT

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // 1️⃣ Fetch enrolled courses
    const enrollments = await EnrollCourse.find({ user_id: userId });

    // 2️⃣ Fetch course details using courseTitle
    const enrolledCoursesWithDetails = await Promise.all(
      enrollments.map(async (enroll) => {
        const course = await Course.findOne({
          title: enroll.courseTitle,
        });

        if (course?.thumbnail) {
          course.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${course.thumbnail}`;
        }

        return {
          ...enroll.toObject(),
          courseDetails: course,
        };
      })
    );

    return res.status(200).json({data:enrolledCoursesWithDetails});
  } catch (error) {
    console.error("Enrolled course error:", error);
    return res.status(500).json({
      message: "Failed to fetch enrolled courses",
      error: error.message,
    });
  }
}

static async courseRecommendations(req,res){

  try {
    let recommandCourse = await Course.find({ rating: { $gte: 4 } });

    if (recommandCourse.length === 0) {
      return res.status(404).send({ message: "No top-rated courses found" });
    }

    recommandCourse = recommandCourse.map((course) => {
      course.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${course.thumbnail}`;
      return course;
    });

    return res.status(200).send({ message: "success", data: recommandCourse });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
}

}
