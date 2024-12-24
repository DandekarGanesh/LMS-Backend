import Course from "../models/course.model.js"
import AppError from "../utils/error.util.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises';


const getAllCourses = async (req,res, next) => {

    try {
        const courses = await Course.find({}).select('-lectures');

        res.status(200).json({
            success: true,
            message: 'Courses Loaded Successfully',
            courses
        });

    } catch(err) {

        return next(new AppError(err.message, 500));
    }
   
}




const getLecturesByCourseId = async (req,res, next) => {
    try {
        const { id } = req.params; 
        const course = await Course.findById(id);

        if(!course) {
            return next(new AppError('Invalid course id', 500));
        }

        res.status(200).send({
            success: true,
            message: 'Course lectures fetched successfully',
            lectures: course.lectures
        });


    } catch(err) {
        return next(new AppError(err.message, 500));
    }
}




const createCourse = async (req, res, next) => {

    try {
        const { title, description, category, createdBy } = req.body;
    
        if(!title || !description || !category || !createdBy) {
            return next(new AppError('All fields required!', 400));
        }
    
        const course = await Course.create({
            title,
            description,
            category,
            createdBy,
            thumbnail: {
                public_id: 'dummy',
                secure_url: 'dummy'
            },
        });
    
    
        if(!course) {
            return next(new AppError('Course could not be created!, please try again', 400));
        }
    
    
        if(req.file) {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            });    
    
            if(result) {
                course.thumbnail.public_id = result.public_id;
                course.thumbnail.secure_url = result.secure_url;
            }
    
            // delete file from upload folder
            fs.rm(`uploads/${req.file.filename}`);
        }
    
        await course.save();
    
        res.status(200).json({
            success: true,
            message: 'Course created Successfully',
            course
        });

    } catch(err) {
        return next(new AppError(err.message, 500));
    }
    
}




const updateCourse = async (req, res, next) => {
    try {
        const { id } = req.params;

        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body // update the things which we got in req.body
            },

            {
                runValidators: true // this checks validations for schema
            }
        );

        if(!course) {
            return next(new AppError('course with given id does not exist', 500));
        }

        

        res.status(200).json({
            success: true,
            message: 'Course updated successfully!',
            course
        });


    } catch(err) {
        return next(new AppError(err.message, 500));
    }

}



const removeCourse = async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await Course.findById(id);

        if(!course) {
            return next(new AppError('Course with the given id does not exist', 500));
        }

        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch(err) {
        return next(new AppError(err.message, 500));
    }

} 




const addLectureToCourseById = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const { id } = req.params;

        if(!title || !description) {
            return next(new AppError('title and description required!!', 400));
        }

        const course = await Course.findById(id);

        if(!course) {
            return next(new AppError('Course does not found', 500));
        }

        const lectureData = {
            title,
            description,
            lecture: {}
        };

    
        
        if(req.file) {

            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms'
            });    
    
            if(result) {
                lectureData.lecture.public_id = result.public_id;
                lectureData.lecture.secure_url = result.secure_url;
            }
    
            // delete file from upload folder
            fs.rm(`uploads/${req.file.filename}`);
        }


        
        course.lectures.push(lectureData);
        course.numberOfLectures = course.lectures.length;

        await course.save();
        
        res.status(200).json({
            success: true,
            message: 'Lecture successfully added to the course',
            course
        });
        
    } catch(err) {
        next(new AppError(err.message, 500));
    }

}




const removeLectureById = async (req,res, next) => {
    try {
        const { courseId, lectureId } = req.params;
        
        const course = await Course.findById(courseId);
        const lectures = course.lectures.filter((lec) => lec._id != lectureId);

        if(lectures.length == course.lectures.length) {
            return next(new AppError('Lecture doesnt exist !!', 400));
        }

        course.lectures = lectures;
        await course.save();
        
        res.status(200).json({
            success: true,
            message: 'Lecture Deleted Successfully!',
            lectures
        });

    } catch(err) {
        return next(new AppError(err.message, 500));
    }
}




export {
    getAllCourses,
    createCourse,
    updateCourse,
    removeCourse,
    removeLectureById,
    getLecturesByCourseId,
    addLectureToCourseById
}