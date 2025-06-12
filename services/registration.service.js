const registrationValidation = require("../validator/registration.validator");
async function userRegistration(req, res) {
  const {
    email,
    firstName,
    lastName,
    phone,
    age,
    occupation,
    nameOfSpouse,
    attendingWithSpouse,
    ageOfSpouse,
    phoneNumberOfSpouse,
    marriageDuration,
    firstTimeAttending,
  } = req.body;
  const validationResponse = await registrationValidation({
    ...req.body,
  });
  if (validationResponse !== true) {
    return res.status(400).json({
      status: "01",
      message: "Validation failed",
      errors: validationResponse,
    });
  }
}

module.exports = { userRegistration };
