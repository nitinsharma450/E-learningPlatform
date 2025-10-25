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
      return res.status(200).json({ message: "Email already exists" });
    }

    
    const studentData = {
      name: details.displayName,
      email: details.email,
      role: "student",
      profilePicture: details.profilePicture || ""
    };

    const response = await studentProfile.create(studentData);

    res.status(200).json({ message: "Success", data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
    }
}