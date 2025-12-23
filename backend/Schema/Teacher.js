import mongoose from "mongoose";
import { type } from "os";

const teacherSchema=mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String, required:true},
    password:{type:String, required:true},
    subject:{type:String, required:true},
    isActive:{type:Boolean},
    lastLogin:{type:Date},
    isBlocked:{type:Boolean,default:false}
})
 const Teacher=mongoose.model('teacher',teacherSchema)
 export default Teacher