const User = require("../models/User");
const { responseMessages } = require("../utils/request-status");
const validateUserInformation = require("../validator/user.validator");
const validateUserSigninInformation = require("../validator/signin.validator");
const encryptPassword = require("../helpers/encrypt");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/authtoken");

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
  const userExist = await User.findOne({ email });
  console.log(userExist);
  if (userExist !== null) {
    return res.status(409).json({
      status: responseMessages["01"],
      message: "User already exist",
    });
  }
  const encryptedPassword = encryptPassword(password);
  const createUser = new User({ ...req.body, password: encryptedPassword });
  const saveUser = createUser.save();
  if (saveUser) {
    res.status(201).json({
      status: responseMessages["00"],
      message: "User saved successfully",
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
  const userExist = await User.findOne({ email });
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

module.exports = { signup, signin };
