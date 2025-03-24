const Validator = require("fastest-validator");
const v = new Validator();

const schema = {
  firstName: { type: "string", min: 1, max: 255 },
  lastName: { type: "string", min: 1, max: 255 },
  email: { type: "email", min: 6, max: 255 },
  password: { type: "string" },
};

const validate = (data) => {
  return v.validate(data, schema);
};

module.exports = validate;
