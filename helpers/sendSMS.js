const { default: axios } = require("axios");

async function sendSms(phone, message) {
  await axios.get(
    `https://clientlogin.bulksmsgh.com/smsapi?key=ddacb9d7-28ba-4238-bf1f-0ed0f5d7447f&to=${phone}&msg=${message}&sender_id=DOUBLES`
  );
}

module.exports = { sendSms };
