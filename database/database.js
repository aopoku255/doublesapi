const { default: mongoose } = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://aopoku255:5mhjojv3w6uCL2hG@cluster0.ltmnhp4.mongodb.net/doubles"
  )
  .then((res) => console.log("Mongodb connected"))
  .catch((err) => console.log("An error occured when connnecting to db"));

// .connect("mongodb://localhost:27017/doubles")
