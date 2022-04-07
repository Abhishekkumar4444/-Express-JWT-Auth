import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated Admin user
    pass: process.env.EMAIL_PASS, // generated Admin password
  },
});
export default transporter;
