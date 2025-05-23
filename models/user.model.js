import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

const userSchema = new Schema({
     fullName: {
        type: 'String',
        required: [true, 'Name is required'],
        minLength: [2, 'Name must be at least 2 character'] ,
        maxLength: [50, 'Name should be less than 50 character'],
        lowercase: true,
        trim: true
     },

     email: {
        type: 'String',
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
     },

     
     password: {
        type: 'String',
        required: [true, 'Password is required'],
        minLength: [4, 'Password must me at least 4 character'],
        select: false,  // dont give password by default ... if explicit query called then give
     },

     avatar: {
        public_id: {
            type: 'String'
        },

        secure_url: {
            type: 'String'
        }
     },

     role: {
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
     },

     forgotPasswordToken: String,
     forgotPasswordExpiry: Date,
     subscription: {
        id: String,
        status: String,
     }
}, {
    timestamps: true   
});




userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});


userSchema.methods = {

    generateJWTToken: async function() {
        return await jwt.sign(
            { id: this._id, email: this.email, subscription: this.subscription, role: this.role},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        );
    },


    comparePassword: async function(plainTextPassword) {
        return (await bcrypt.compare(plainTextPassword, this.password));
    },



    generatePasswordResetToken: async function() {
        const resetToken = crypto.randomBytes(20).toString('hex');

        this.forgotPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
            ;

        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;   // 15 min from now

        return resetToken;
    }

}




const User = model('User', userSchema);

export default User;
