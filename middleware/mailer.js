const nodemailer = require("nodemailer");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

async function sendMail(mailOptions) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE, 
      host: process.env.HOST,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASSWORD     
      },
    });
    
    const result = await transporter.sendMail(mailOptions);
    return result;

  } catch (err) {
    return err;
  }

}



module.exports = sendMail;
