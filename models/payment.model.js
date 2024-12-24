import { model, Schema } from "mongoose";

const paymentSchema = new Schema({
     razorpay_payment_id: {
        type: String,
        required: [true, 'razorpay payment id required']
     },

     razorpay_subscription_id: {
        type: String,
        required: [true, 'razorpay subscription id required']
     },

     razorpay_signature: {
        type: String,
        required: [true, 'razorpay signature required']
     }
}, {
    timestamps: true
});



const Payment = model('Payment', paymentSchema);


export default Payment;