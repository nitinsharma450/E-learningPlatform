import { io } from "../../index.js";
import Course from "../../Schema/Course.js";
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
        
              io.emit('userStatusChange',{userId:userId,isActive:false})
        return res.send({message:'success',status:200})
        
       }
       
       
      } catch (error) {
        return res.status(500).send({message:error.message})
      }
    }
}