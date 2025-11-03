import mongoose from 'mongoose'

let courseContentSchema=mongoose.Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    contentUrl:{type:String, required:true},
    contentType:{type:String,required:true},
    uploadedAt:{type:Date,default:Date.now()},

    course:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
        // required:true
    }
})

 export const CourseContent =
  mongoose.models.courseContent || mongoose.model("courseContent", courseContentSchema);


