import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import miscRoutes from './routes/miscRoutes.js';
import errorMiddleware from './middlewares/error.middleware.js';

config();
const app = express();

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true
// }));


const allowedOrigins = process.env.FRONTEND_URL;

app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
  
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
    ],
    exposedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers"
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));
  
  
  
  // Handle preflight requests for all routes
  app.options('*', cors()); // Automatically handles preflight requests



app.use(express.json());


app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


// app.use('/ping', (req,res) => {
//     res.send("Helo");
// });



app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1", miscRoutes);


app.all('*', (req,res) => {
    res.status(404).send("OOPS!! 404 Page not found");
});


app.use(errorMiddleware);

export default app;