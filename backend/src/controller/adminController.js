import Teacher from "../../Schema/Teacher.js";

export class adminController {

    static async create(req, res) {
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

    static async count(req,res){
        console.log('hello')

        try {
            
      let count=await Teacher.countDocument();
      if(count.length>0){
        res.send({message:'success',status:200,data:count})
      }


        } 
        catch (error) {
            res.send({message:error.message,status:500})
        }
    }
}
