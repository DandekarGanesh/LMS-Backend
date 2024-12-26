import User from "../models/user.model.js"
import AppError from "../utils/error.util.js";



export const getStatsData = async (req, res, next) => {
    try {

        const users = await User.find({});
        const allUsersCount = users.length;
        let subscribedUserCount = 0;
        
        users.map((user) => user.subscription.id ? subscribedUserCount++ : "");

       res.status(200).send({
          success: true,
          message: "Data Fetched Successfully!",
          allUsersCount: allUsersCount,
          subscribedUserCount: subscribedUserCount
       });

    } catch(err) {
        return next(new AppError(err.message, 500));
    }
    
}



export const contactUs = (req, res) => {
      
    // Under Development

    return res.status(200).json({
        success: true,
        message: "Form Submitted"
    });
}