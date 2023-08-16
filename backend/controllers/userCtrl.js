const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const PasswordResetToken = require('../models/passwordResetToken')
const sendPasswordResetEmail = require('../service/emailservice');
exports.signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });
    console.log(existingUser);
    if (existingUser) {
      return res.status(200).json({
        success: false,
        message: "User already exists",
      });
    }

    let hashpassword;
    try {
      hashpassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error hashing password",
      });
    }
    const user = User.create({
      username,
      email,
      password: hashpassword,
    });

    return res.status(200).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Error creating user",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your password or email dont leave it !",
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }
    const payload = {
      email: user.email,
      id: user.id,
    };
    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });
      user.token = token;
      user.password = undefined;
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 + 1000),
        httpOnly: true,
      };
      console.log(user);
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User logged in succesfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.forgotPassword = async (req, res) => {

    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const payload = {
        email,
        
    }
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'60sec'})
  
    await PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt: Date.now() + 3600000000,
    });
  
    sendPasswordResetEmail(email, token);
  
    res.status(200).json({ message: 'Password reset email sent successfully' }); 
}
exports.resetPassword=async(req,res)=>{
  const { token, newPassword } = req.body;

  const resetToken = await PasswordResetToken.findOne({ where: { token } });
  console.log(resetToken);
  console.log(resetToken.expiresAt < Date.now());

  if (!resetToken || resetToken.expiresAt < Date.now()) {
    return res.status(400).json({ error: "invalid password"});
  }

  const user = await User.findByPk(resetToken.userId);

  
  let hashpassword;
    try {
      hashpassword = await bcrypt.hash(newPassword, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error hashing password",
      });
    }
  user.password = hashpassword;
  await user.save();

  await resetToken.destroy();

  res.status(200).json({ message: 'Password reset successful' });
}


