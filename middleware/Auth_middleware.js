import jwt from "jsonwebtoken";
import userModel from "../models/User.js";

const userAuth = async (req, res, next) => {
  let token;
  // const { authorization } = req.headers;
  const authHeader = req.headers.authorization;
  //? checking if authorization have token or not
  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      //? getting token from user header
      token = authHeader.split(" ")[1];

      //? checking for token
      // console.log(`Token ::${token}`);
      // console.log(`AuthHeader :- ${authHeader}`);

      //? verify token
      const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);

      //? get user  token from after matched token except password
      req.user = await userModel.findById(userId).select("-password");
      next();
    } catch (error) {
      res.status(401).send({ status: "failed", message: "UnAuthorised User" });
    }
  }
  if (!token) {
    res.status(401).send({
      status: "failed",
      message: "UnAuthorised user having  No Token",
    });
  }
};

export default userAuth;
