import nodemailer from 'nodemailer';


async function sendMail(email, subject, message) {
    
//   let transporter =
//     nodemailer.createTransport(
//         {
//             service: 'gmail',
//             auth: {
//                 user: process.env.SMTP_USERNAME,   
//                 pass: process.env.SMTP_PASSWORD
//             }
//         }
//     );



//      let info = await transporter.sendMail({
//           from: process.env.SMTP_FROM_MAIL, // sender address
//           to: email, // list of receivers
//           subject: subject, // Subject line
//           html: message
//      });



//      transporter
//     .sendMail(info,
//         function (err, data) {
//             if (err) {
//                 console.log('Error Occurs');
//             } else {
//                 console.log('Email sent successfully');
//             }
//         });

    console.log(email,"  ",subject);
    console.log("message :"+message);    
}


export default sendMail;