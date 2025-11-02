import Teacher from "../../Schema/Teacher.js"
import jwt from 'jsonwebtoken'
import { SecretConfigs } from "../configs/SecretConfigs.js"
import fs from "fs";
import path from "path";
import Course from '../../Schema/Course.js';
import { ServerConfigs } from "../configs/ServerConfigs.js";
import { couseContent } from "../../Schema/courseContent.js";



export class teacherController{

    static async login(req,res){
        try {
            let loginForm=req.body
            console.log(loginForm)
            loginForm.username=loginForm.username.toLowerCase()
            loginForm.subject=loginForm.subject.toLowerCase()
            

            let details= await Teacher.findOne({username:loginForm.username})
            console.log(details)
            if(details){
                if(details.password==loginForm.password && details.subject==loginForm.subject){

                    let token=jwt.sign({
                        username:details.username,
                         name:details.name,
                        subject:details.subject
                    },SecretConfigs.JWT_SECRET_KEY,{expiresIn:'3h'})
                    
                    res.status(200).send({message:'success',status:200,token,data:details})
                }
                else{
                    res.status(401).send({message:'invalid credentials',status:401})
                }
            }
            else{
                res.status(401).send({message:'invalid credentials',status:401})
            }

        } catch (error) {
            res.status(500).send({message:'internal server error',status:500})
        }
    }
    static async courseContent(req,res){


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
    else if ([".mp4", ".mov", ".avi", ".mkv"].includes(ext)) fileType = "videos";
    else if ([".pdf", ".docx", ".pptx"].includes(ext)) fileType = "pdfs";

    const typeFolder = path.join(uploadDir, fileType);
    if (!fs.existsSync(typeFolder)) fs.mkdirSync(typeFolder, { recursive: true });

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
        contentType: body.contentType
        
      };

      const response = await couseContent.create(newCourse);
      return res.status(200).json({
        message: "success",
        status: 200,
        data: response,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

static async searchAllTitle(req,res){

    try {
        let courses=await Course.find()
        let title=[];
        if(courses){
            courses.map((course)=>{
                title.push(course.title)
            })
        }
        return res.status(200).send({message:'success',status:200,data:title})
    } catch (error) {
        console.error("Server error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }

    }}
