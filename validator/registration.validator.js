const Validator = require("fastest-validator");
const v = new Validator();

const schema = {
  email: { type: "email", min: 6, max: 255 },
  firstName: { type: "string", min: 1, max: 50 },
  lastName: { type: "string", min: 1, max: 50 },
  phone: { type: "string", min: 10, max: 15 },
  age: { type: "number", min: 0, max: 120 },
  occupation: { type: "string", min: 1, max: 100 },
  attendingWithSpouse: { type: "boolean", optional: true },
};

const validate = (data) => {
  return v.validate(data, schema);
};

module.exports = validate;
