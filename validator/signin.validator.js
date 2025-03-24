const Validator = require("fastest-validator");
const v = new Validator();

const schema = {
  email: { type: "email", min: 6, max: 255 },
  password: { type: "string" },
};

const validate = (data) => {
  return v.validate(data, schema);
};

module.exports = validate;
