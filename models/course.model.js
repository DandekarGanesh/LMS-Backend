import { model, Schema } from 'mongoose';

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [4, 'Title must be atleast 4 character'],
        maxLength: [60, 'Title should be less than 60 character'],
        trim: true
    },

    description: {
        type: String,
        required: [true, 'description is required'],
        minLength: [4, 'description must be atleast 4 character'],
        maxLength: [200, 'description should be less than 100 character'],
        trim: true
    },

    category: {
        type: String,
        required: [true, 'category is required'],
    },


    thumbnail: {
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
           type: String,
           required: true
        }
    },

    lectures: [
        {
            title: String,
            description: String,
            lecture: {
                public_id: {
                    type: String,
                },
                secure_url: {
                   type: String,
                }
            }
        }
    ],

    numberOfLectures: {
        type: Number,
        default: 0
    },

    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});



const Course = new model('Course', courseSchema);


export default Course;