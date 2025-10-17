import mongoose from "mongoose";

const teacherSchema=mongoose.Schema({
    name:{type:String,required:true},
    username:{type:String, required:true},
    password:{type:Number, required:true},
    subject:{type:String, required:true}
})
 const Teacher=mongoose.model('teacher',teacherSchema)
 export default Teacher