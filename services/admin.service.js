const { responseMessages } = require("../utils/request-status");
const validateUserInformation = require("../validator/user.validator");
const validateUserSigninInformation = require("../validator/signin.validator");
const encryptPassword = require("../helpers/encrypt");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/authtoken");
const models = require("../models");
const sendMail = require("../helpers/sendMail");
const adminwelcome = require("../helpers/mail/adminwelcome");

async function signup(req, res) {
  const validationResponse = await validateUserInformation({ ...req.body });
  if (validationResponse !== true) {
    return res.status(400).json({
      status: responseMessages["01"],
      message: "Validation failed",
      errors: validationResponse,
    });
  }

  const { email, firstName, lastName, password } = req.body;

  try {
    const userExist = await models.Admin.findOne({ where: { email } });
    if (userExist !== null) {
      return res.status(409).json({
        status: responseMessages["01"],
        message: "User already exists",
      });
    }

    const encryptedPassword = encryptPassword(password);
    const newAdmin = await models.Admin.create({
      ...req.body,
      password: encryptedPassword,
    });

    if (newAdmin) {
      await sendMail(email, adminwelcome(email, password));
      return res.status(201).json({
        status: responseMessages["00"],
        message: "User saved successfully",
      });
    }
  } catch (error) {
    console.error("signup error:", error);
    return res.status(500).json({
      status: responseMessages["99"],
      message: "Internal Server Error",
    });
  }
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

  try {
    const userExist = await models.Admin.findOne({ where: { email } });
    if (userExist === null) {
      return res.status(401).json({
        status: responseMessages["01"],
        message: "This user is not registered",
      });
    }

    const validPassword = bcrypt.compareSync(password, userExist.password);

    if (!validPassword) {
      return res.status(401).json({
        status: responseMessages["01"],
        message: "Invalid email or password",
      });
    }

    // Exclude password before token generation if needed
    const userData = userExist.toJSON();
    delete userData.password;

    const accessToken = await generateToken(userData);

    return res.status(201).json({
      status: responseMessages["00"],
      message: "User signin successful",
      data: userData,
      token: accessToken,
    });
  } catch (error) {
    console.error("signin error:", error);
    return res.status(500).json({
      status: responseMessages["02"],
      message: "Internal Server Error",
    });
  }
}

async function getAdmins(req, res) {
  try {
    const admins = await models.Admin.findAll({
      attributes: { exclude: ["password"] }, // Exclude sensitive data
    });

    return res.status(200).json({
      status: responseMessages["00"],
      message: "Admins retrieved successfully",
      data: admins,
    });
  } catch (error) {
    console.error("getAdmins error:", error);
    return res.status(500).json({
      status: responseMessages["02"],
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

module.exports = { signup, signin, getAdmins };
