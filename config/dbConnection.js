import mongoose from "mongoose";

mongoose.set('strictQuery', false); // on wrong query dont give error just ignore

const connectionToDB = async () => {

    try {
        const { connection } = await mongoose.connect(
            process.env.Mongo_URL || 'mongodb://localhost/lms'
        );
    
        if(connection) {
            console.log(`Connected to MongoDB: ${connection.host}`);
        }

    } catch(err) {
        console.log(err);
        process.kill(1);  // terminate the node js process
    }

}


export default connectionToDB;