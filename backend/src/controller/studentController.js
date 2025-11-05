import { io } from "../../index.js";
import Course from "../../Schema/Course.js";
import { CourseContent } from "../../Schema/CourseContent.js";

import { EnrollCourse } from "../../Schema/EnrollCourse.js";
import { studentProfile } from "../../Schema/studentProfile.js";
import { ServerConfigs } from "../configs/ServerConfigs.js";


export class studentController{


    static async searchAll(req,res){

        try {
            let courses=await Course.find()

              courses = courses.map(course => {
                 const c = course.toObject(); // convert to plain object
                 c.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.thumbnail}`;
                 return c;
               });

            if(courses.length>0){
                return res.status(200).send({message:'success',data:courses})
            }
        } catch (error) {
             return res.status(500).send({error:error.message})
        }
    }

    static async filter(req,res){
        try {
            let filterKey=req.body
            console.log(filterKey)
            if(!filterKey){
                return res.status(500).send({message:'filter Key is required'})
            }
            let key=filterKey.key

            let response=await Course.find({
      $or: [
        { title: { $regex: key, $options: "i" } },        // Like on title
        { description: { $regex: key, $options: "i" } }, 
        { category: { $regex: key, $options: "i" } },     
        { level: { $regex: key, $options: "i" } }        
      ],
    })

      response = response.map(course => {
                 const c = course.toObject(); // convert to plain object
                 c.thumbnail = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.thumbnail}`;
                 return c;
               });

    if(response.length>0){
        return res.status(200).send({message:'success',data:response})
    }
     else {
  return res.status(200).send({ message: 'No matching courses found', data:[]});
}
        } catch (error) {
            return res.status(500).send({message:error.message})
        }
    }   

    static async saveCredentials(req,res){
     try {
    const details = req.body;

    // ✅ Validate input
    if (!details || !details.email || !details.displayName) {
      return res.status(400).json({ message: "Name and Email are required" });
    }

    
    const existingAdmin = await studentProfile.findOne({ email: details.email });
    if (existingAdmin) {
      let response=await studentProfile.findOneAndUpdate({email:details.email},{$set:{isActive:true,lastLogin:new Date()}})
      io.emit('userStatusChange',{userId:response.userId,isActive:true})
      return res.status(200).json({ message: "Email already exists",status:200 ,data:response});
    }

    
    const studentData = {
      userId:details.uid,
      name: details.displayName,
      email: details.email,
      role: "student",
      profilePicture: details.profilePicture || "",
      lastLogin: details.lastLoginAt,
      isActive:true
    };

    const response = await studentProfile.create(studentData);
    io.emit('userStatusChange',{userId:response.userId,isActive:true})

    return res.status(200).json({ message: "Success", data: response,status:200 });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
    }

    static async searchProfile(req,res){
      try {
        let {email}=req.body;
        let response=await studentProfile.findOne({email:email})
        if(response){
          return res.status(200).send({message:'success',data:response,status:200})
        }
      } catch (error) {
        return res.status(500).send({message:error.message})
      }
    }

    static async logout(req,res){
      try {
        let {userId}=req.body
        console.log(userId)
    
       if(userId){
             let response=await studentProfile.findOneAndUpdate({userId:userId},{$set:{isActive:false,lastLogin:new Date()}})
             console.log(response)

             let resp=await EnrollCourse.findOneAndUpdate({user_id:userId},{$set:{isActive:false}})
             console.log(resp)
        
              io.emit('userStatusChange',{userId:userId,isActive:false})
        return res.send({message:'success',status:200})
        
       }
       
       
      } catch (error) {
        return res.status(500).send({message:error.message})
      }
    }

    static async searchCourseByTitle(req,res){
      let courseTitle=req.param

      console.log(courseTitle)
      try {
        console.log(courseTitle)
         let course=await CourseContent.find({courseTitle})
         if(course){
          console.log(course)

           course = course.map(course => {
                 const c = course.toObject(); // convert to plain object
                 c.contentUrl = `${ServerConfigs.Host}:${ServerConfigs.Port}/${ServerConfigs.PublicFolder}/${c.contentUrl}`;
                 return c;
               });

               return res.status(200).send({message:'success',data:course,status:200})
         }
      } catch (error) {
        
        return res.status(500).send({error:error.message})
      }
    }

   static async enroll(req, res) {
  try {
    const enrollDetails = req.body;
    console.log("Enroll details:", enrollDetails);

    const { user_id, courseTitle } = enrollDetails;

    // ✅ Validate required fields
    if (!user_id || !courseTitle) {
      return res.status(400).send({ message: "user_id and courseTitle are required" });
    }

    // ✅ Check if user already enrolled
    const existingEnrollment = await EnrollCourse.findOne({
      user_id: user_id,
      courseTitle: courseTitle,
    });

    if (existingEnrollment) {
      // ✅ Reactivate existing enrollment
      await EnrollCourse.updateMany({ user_id }, { $set: { isActive: true } });


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


}

