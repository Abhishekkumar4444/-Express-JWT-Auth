import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import transporter from "../config/emailConfig.js";
// const saltRounds = 10;

import jwt from "jsonwebtoken";

class UserController {
  static UserRegistration = async (req, res) => {
    const { name, email, password, password_confirmation, tc } = req.body;
    const user = await userModel.findOne({ email: email });
    //? checking that if user already exists or not ....
    if (user) {
      res.send({ status: "failed", message: "User Already Exits" });
    } else {
      if (name && email && password && password_confirmation && tc) {
        if (password === password_confirmation) {
          //? hashpassword encrypted
          const saltRounds = await bcrypt.genSalt(10);
          const hashpassword = await bcrypt.hash(password, saltRounds);
          try {
            const doc = new userModel({
              name: name,
              email: email,
              password: hashpassword,
              tc: tc,
            });
            await doc.save();
            const saved_User = await userModel.findOne({ email: email });
            //?generating jwt tokens
            const tokens = jwt.sign(
              { userId: saved_User._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );

            res.status(201).send({
              status: "success",
              message: "User successfully registered",
              token: tokens,
            });
          } catch (error) {
            res.send({ status: "failed", message: "Unable to register" });
          }
        } else {
          res.send({ status: "failed", message: "password not match" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    }
  };

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        //? checking email is registered or not
        const user = await userModel.findOne({ email: email });
        if (user != null) {
          const isPassMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isPassMatch) {
            //?generating jwt tokens
            const tokens = jwt.sign(
              { userId: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "Login successfully",
              token: tokens,
            });
          } else {
            res.send({
              status: "failed",
              message: "email or password mismatch",
            });
          }
        } else {
          res.send({ status: "failed", message: "User Not Found" });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Unable to Login" });
    }
  };

  static changePassword = async (req, res) => {
    const { password, password_confirmation } = req.body;
    //? checking for password match
    if ((password, password_confirmation)) {
      if (password !== password_confirmation) {
        res.send({ status: "failed", message: "password doesnot matched" });
      } else {
        //?  creating hashpassword
        const saltRounds = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, saltRounds);

        // console.log(req.user);
        await userModel.findByIdAndUpdate(req.user._id, {
          $set: { password: hashpassword },
        });
        res.send({
          status: "success",
          message: "password changed successfully",
        });
      }
    } else {
      res.send({ status: "failed", message: "All fields are required" });
    }
  };
  static loggedUser = async (req, res) => {
    res.send({ user: req.user });
  };

  static sendUserResetPasswordEmail = async (req, res) => {
    const { email } = req.body;
    if (email) {
      const user = await userModel.findOne({ email: email });
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ user: user._id }, secret, {
          expiresIn: "15m",
        });
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`;

        let info = await transporter.sendMail({
          from: process.env.EMAIL_FROM, // sender address
          to: user.email, // list of receivers
          subject: "Hello world ", // Subject line

          html: `<a href=${link}>Click here</a> <b>to RESET your password</b>`, // html body
        });
        console.log(info);
        res.send({
          status: "success",
          message:
            "reset password email link sent successfully,check your mail",
          info: info,
        });
      } else {
        res.send({ status: "failed", message: "email id doesnot exists" });
      }
    } else {
      res.send({ status: "failed", message: "plz enter valid email" });
    }
  };
  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation } = req.body;
    const { id, token } = req.params;
    const user = await userModel.findById(id);
    const NEW_SECRET = user._id + process.env.JWT_SECRET_KEY;
    try {
      jwt.verify(token, NEW_SECRET);
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({ status: "failed", message: "password didnot match" });
        } else {
          //?  creating hashpassword
          const saltRounds = await bcrypt.genSalt(10);
          const hashpassword = await bcrypt.hash(password, saltRounds);
          await userModel.findByIdAndUpdate(user._id, {
            $set: { password: hashpassword },
          });
          res.send({
            status: "success",
            message: " password reset successfully",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fiels are required" });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default UserController;
