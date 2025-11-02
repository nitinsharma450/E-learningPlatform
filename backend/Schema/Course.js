import mongoose from "mongoose";

const courseSchema=mongoose.Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true},
    level:{type:String,required:true},
    duration:{type:String,required:true},
    thumbnail:{type:String,required:true},

    teacher:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Teacher',
        required:true
    },

    contents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'courseContent'
        }
    ]


})

const Course=mongoose.model('course',courseSchema)
export default Course