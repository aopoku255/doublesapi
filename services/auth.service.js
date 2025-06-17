const models = require("../models");
const { responseMessages } = require("../utils/request-status");
const validateUserInformation = require("../validator/user.validator");
const validateUserSigninInformation = require("../validator/signin.validator");
const encryptPassword = require("../helpers/encrypt");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/authtoken");
const sendMail = require("../helpers/sendMail");
const welcome = require("../helpers/mail/welcome");
const { generateOTP } = require("../helpers/generateOTP");
const { sendSms } = require("../helpers/sendSMS");
const userOtp = require("../helpers/mail/userOtp");
const { Op } = require("sequelize");

async function signup(req, res) {
  try {
    const validationResponse = await validateUserInformation({ ...req.body });
    if (validationResponse !== true) {
      return res.status(400).json({
        status: responseMessages["01"],
        message: "Validation failed",
        errors: validationResponse,
      });
    }

    const { email, phone, password } = req.body;

    const userExist = await models.User.findOne({ where: { email } });
    if (userExist) {
      return res.status(409).json({
        status: responseMessages["01"],
        message: "User already exists",
      });
    }

    const encryptedPassword = encryptPassword(password);
    const otp = await generateOTP();

    const user = await models.User.create({
      ...req.body,
      password: encryptedPassword,
    });

    const userotp = await models.Otp.create({
      userId: user.id,
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendSms(
      phone,
      `${otp} is your verification code. For your security, do not share this code.`
    );
    await sendMail(email, userOtp(otp));

    return res.status(201).json({
      status: responseMessages["00"],
      message: "User saved successfully",
      data: userotp,
    });
  } catch (error) {
    return res.status(500).json({
      status: responseMessages["02"],
      message: "Internal Server Error",
    });
  }
}

async function verifyOtp(req, res) {
  const { userId, code } = req.body;

  const otpRecord = await models.Otp.findOne({
    where: {
      userId,
      code,
      verified: false,
      expiresAt: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (!otpRecord) {
    return res.status(400).json({
      status: responseMessages["01"],
      message: "Invalid or expired OTP.",
    });
  }

  otpRecord.verified = true;
  await otpRecord.save();

  return res.status(200).json({
    status: responseMessages["00"],
    message: "OTP verified successfully.",
  });
}

async function signin(req, res) {
  const validationResponse = await validateUserSigninInformation({
    ...req.body,
  });
  if (validationResponse !== true) {
    return res.status(400).json({
      status: responseMessages["01"],
      message: "Validation failed",
      errors: validationResponse,
    });
  }

  const { email, password } = req.body;
  const userExist = await models.User.findOne({ where: { email } });
  if (userExist === null) {
    return res.status(401).json({
      status: responseMessages["01"],
      message: "This user is not registered",
    });
  }

  const validPassword = bcrypt.compareSync(password, userExist?.password);

  if (!validPassword) {
    return res.status(401).json({
      status: responseMessages["01"],
      message: "Invalid email or password",
    });
  }

  const accessToken = await generateToken({ ...userExist });

  return res.status(201).json({
    status: responseMessages["00"],
    message: "User signin successful",
    data: userExist,
    token: accessToken,
  });
}

async function getUserInfo(req, res) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      status: responseMessages["01"],
      message: "User ID is required",
    });
  }

  try {
    const user = await models.User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        status: responseMessages["01"],
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: responseMessages["00"],
      message: "User information retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error("getUserInfo error:", error);
    return res.status(500).json({
      status: responseMessages["99"],
      message: "Internal Server Error",
    });
  }
}

async function updateUserInfo(req, res) {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).json({
      status: responseMessages["01"],
      message: "User ID is required",
    });
  }

  try {
    const user = await models.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: responseMessages["01"],
        message: "User not found",
      });
    }

    console.log(req.body);

    // Update user fields
    await user.update({ ...req.body });

    return res.status(200).json({
      status: responseMessages["00"],
      message: "User information updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("updateUserInfo error:", error);
    return res.status(500).json({
      status: responseMessages["99"],
      message: "Internal Server Error",
    });
  }
}

module.exports = { signup, signin, verifyOtp, getUserInfo, updateUserInfo };
