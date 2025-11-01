import Teacher from "../../Schema/Teacher.js"
import jwt from 'jsonwebtoken'
import { SecretConfigs } from "../configs/SecretConfigs.js"

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
}