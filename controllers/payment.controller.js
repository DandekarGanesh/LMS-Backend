import AppError from "../utils/error.util.js";
import User from '../models/user.model.js';
import { razorpay } from '../server.js';
import crypto from 'crypto';
import Payment from '../models/payment.model.js';
import moment from 'moment';  // Convert Unix timestamp to date


const getRazorpayApiKey = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Razorpay API key',
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch(err) {
        return next(new AppError(err.message, 500));
    }
}


const buySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

    
        if(!user) {
            return next(new AppError('User doesnt exist!', 400));
        }
    
        // if(user.role === 'ADMIN') {
        //     return next(new AppError('Admin can not purchase a Subscription', 400));
        // }
    

        const subscription = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID,
            customer_notify: 1,
            total_count: 1,
        });

        // const plan_id = process.env.RAZORPAY_PLAN_ID;

        // const subscription = await razorpay.subscriptions.create({
        //     plan_id,
        //     customer_notify: 1,
        //     total_count: 6,
        // });

        user.subscription.id = subscription.id;
        user.subscription.status = subscription.status;

    
        await user.save();
    
        res.status(200).json({
            success: true,
            message: 'Subscribed successfully',
            subscription_id: subscription.id
        });

    } catch(err) {
        return next(new AppError(err.message, 500));
    }
}




const verifySubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { razorpay_payment_id,  razorpay_signature, razorpay_subscription_id } = req.body;
    
        const user = await User.findById(id);
    
        if(!user) {
            return next(new AppError('Unauthorized please login'));
        }
    
        const subscriptionId = user.subscription.id;
    
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_SECRET)
            .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
            .digest('hex');
    
        if(generatedSignature !== razorpay_signature) {
            return next(new AppError('Payment not verified, please try again', 500));
        }
    
    
        await Payment.create({
            razorpay_payment_id,
            razorpay_signature,
            razorpay_subscription_id
        });
    
    
        user.subscription.status = 'active';
        await user.save();
    
        res.status(200).json({
            success: true,
            message: 'Payment verified successfully!'
        });

    } catch(err) {
        console.log("error occured");
        return next(new AppError(err.message, 500));
    }

} 




const cancelSubscription = async (req, res, next) => {
    try {
        const { id } = req.user;
    
        const user = await User.findById(id);
    
        if(!user) {
            return next(new AppError('User doesnt exist!', 400));
        }
       
        if(user.role === 'ADMIN') {
            return next(new AppError('Admin can not cancel a Subscription', 400));
        }

    
        const subscriptionId = user.subscription.id;
    
        await razorpay.subscriptions.cancel(subscriptionId);
        

        console.log("id :",id);
    
        // user.subscription.status = subscription.status;
    
        await user.save();

    } catch(err) {
        console.log(err);
        next(new AppError(err.message, 500));
    }
}





const allPayments = async (req, res, next) => {
    try {
        const { count } = req.query;
    
        const subscriptions = await razorpay.subscriptions.all({
            count: count || 10,
        });

        // let finalMonths = 0;

        // for(let sub in subscriptions.items) {
        //     const subData = subscriptions.items[sub];

        //     const startDate = moment.unix(subData.current_start);  // Convert Unix timestamp to date
        //     const endDate = moment.unix(subData.current_end);

        //     const durationInDays = endDate.diff(startDate, 'days');

        //     if(durationInDays <= 30) {
        //         // finalMonths.push(subData);
        //         finalMonths++;
        //     }
        // }

        // console.log(subscriptions.items[0].plan);
        // console.log("finalMonths :",finalMonths);
       
        res.status(200).json({
            success: true,
            message: 'All payments',
            subscriptions,
        });

    } catch(err) {
        console.log(err.message);
        return next(new AppError(err.message, 500));
    }
}




export {
    allPayments,
    buySubscription,
    getRazorpayApiKey,
    cancelSubscription,
    verifySubscription,
}