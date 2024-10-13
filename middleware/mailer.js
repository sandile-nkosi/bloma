const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { response } = require("express");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;


const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: process.env.SERVICE, 
      host: process.env.HOST,
      port: 465,
      secure: true,
      auth: {
        type: process.env.TYPE,
        user: process.env.USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken         
      },
    });
    

    const result = await transporter.sendMail(mailOptions);
    return result;
    

  } catch (err) {
    return err;
  }

}



module.exports = sendMail;
