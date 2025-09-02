
// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
//   port: process.env.SMTP_PORT || 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER || 'set',
//     pass: process.env.SMTP_PASS || 'set',
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.log("SMTP CONNECTION ERROE", error);
//   } else {
//     console.log("SMTP SERVER CONNECTED SUCCESSFULLY");
//   }
// });

// export const sendOTPtoEmail = async (email, otp) => {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject: "OTP VERIFICATION OF TASK MANAGER",
//     html: `<p>${otp}</p>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     const err = new Error("Failed to send email");
//     error.statusCode = 400;
//     throw err;
//   }
// };



//for send otp to gmail
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER ,  
    pass: process.env.GMAIL_PASS ,    
  },
  tls: {
    rejectUnauthorized: false,  
  },
});


transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP CONNECTION ERROR', error);
  } else {
    console.log('SMTP SERVER CONNECTED SUCCESSFULLY');
  }
});

export const sendOTPtoEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,  
    to: email,  
    subject: 'OTP VERIFICATION OF TASK MANAGER',
    html: `
      <h3>Your OTP Code</h3>
      <p style="font-size: 20px; font-weight: bold;">${otp}</p>
      <p>This code will expire in 10 minutes.</p>
    `,  
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}`);
    return true;
  } 
  catch (error) {
    const err = new Error('Failed to send email');
    error.statusCode = 400;
    throw err;
  }
};

