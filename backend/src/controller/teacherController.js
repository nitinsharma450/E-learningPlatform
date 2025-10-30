import Teacher from "../../Schema/Teacher.js"

export class teacherController{

    static async login(req,res){
        try {
            let loginForm=req.body
            console.log(loginForm)

            let details= await Teacher.findOne({username:loginForm.username})
            if(details){
                if(details.password==loginForm.password && details.subject==loginForm.subject){
                    res.status(200).send({message:'success',status:200})
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
}