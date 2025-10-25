import mongoose from "mongoose";

const studentSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,required:true,default:"student"},
    profilePicture:{type:String,default:""}
})

export const studentProfile=mongoose.model('studentProfile',studentSchema)