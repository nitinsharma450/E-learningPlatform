import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true
    },
    courseId: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    time:{type:Date,required:true}
  },

);

// Prevent same student from rating same course multiple times
ratingSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);

export default Rating;
