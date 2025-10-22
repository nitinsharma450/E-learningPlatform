import adminProfile from "../../Schema/Adminprofile.js";
import Teacher from "../../Schema/Teacher.js";
import fs from 'fs'
import { ServerConfigs } from "../configs/ServerConfigs.js";
import Course from "../../Schema/Course.js";
import path from 'path'

export class adminController {

    static async teacherCreate(req, res) {
        const teacherData = req.body;
        console.log("Incoming teacher data:", teacherData);

        try {
            const newTeacher = await Teacher.create(teacherData);
            res.json({
                message: "Teacher created successfully",
                status: 200
            });
        } catch (error) {
            console.error("Error creating teacher:", error);
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }

    static async teacherCount(req,res){
       

        try {
            
      let count=await Teacher.countDocuments();
      if(count>0){
        res.send({message:'success',status:200,data:count})
      }


        } 
        catch (error) {
            res.status(500).send({message:error.message,status:500})
        }
    }

 static async teacherCredentialSave(req, res) {
  try {
    const details = req.body;

    // ✅ Validate input
    if (!details || !details.email || !details.displayName) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    // ✅ Check if admin already exists
    const existingAdmin = await adminProfile.findOne({ email: details.email });
    if (existingAdmin) {
      return res.status(200).json({ message: "Email already exists" });
    }

    // ✅ Create new admin profile
    const adminData = {
      name: details.displayName,
      email: details.email,
      role: "admin",
      profilePicture: details.profilePicture || ""
    };

    const response = await adminProfile.create(adminData);

    res.status(200).json({ message: "Success", data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


static async searchProfile(req,res){
 try {
  let email=req.body
  console.log('email is ',email)

    let data=await adminProfile.find(email)
    if(data){
        res.status(200).send({message:'success',data})
    }
 } catch (error) {
    res.status(500).send({message:error.message})
 }
}

static async searchTeacher(req, res) {
  try {
    const response = await Teacher.find();

    if (response.length > 0) {
      res.status(200).send({ message: 'success', data: response });
    } else {
      res.status(404).send({ message: 'No teachers found' });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

static async courseCreate(req,res){
     
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

  console.log(body)
         const newCourse = {
            title: body.title,
            description: body.description,
            category: body.category,
            level: body.level,
            duration: body.duration,
            thumbnail: imageUrl
         };
let response=await Course.create(newCourse)
 return res.status(200).send({message:'success',status:200,data:response})
       
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

    response = response.map(course => {
      const c = course.toObject(); // convert to plain object
      c.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.thumbnail}`;
      return c;
    });

    if (response.length > 0) {
      return res.status(200).send({ message: 'success', data: response });
    } else {
      return res.status(404).send({ message: 'No courses found' });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

static async filter(req, res) {
  try {
    const keyword = req.body;
    console.log(keyword)

    // Validate input
    if (!keyword) {
      return res.status(400).send({ message: "Keyword is required" });
    }
  let key=keyword.key
  
    const response = await Course.find({
      $or: [
        { title: { $regex: key, $options: "i" } },        // Like on title
        { description: { $regex: key, $options: "i" } }, 
        { category: { $regex: key, $options: "i" } },     
        { level: { $regex: key, $options: "i" } }        
      ],
    });

    if (response.length > 0) {

       response = response.map(course => {
      const c = course.toObject(); // convert to plain object
      c.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.thumbnail}`;
      return c;
    });
      return res
        .status(200)
        .send({ message: "success", status: 200, data: response });
    } else {
      return res
        .status(200)
        .send({ message: "No courses found",data:[] });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}


}


