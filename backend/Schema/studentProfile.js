import mongoose from "mongoose";

const studentSchema=mongoose.Schema({
    userId:{type:String,required:true},
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    role:{type:String,required:true,default:"student"},
    profilePicture:{type:String,default:""},
    lastLogin:{type:Date, required:true},
    isActive:{type:Boolean,required:true}
})

export const studentProfile=mongoose.model('studentProfile',studentSchema)