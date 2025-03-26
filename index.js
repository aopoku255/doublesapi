const express = require("express");
const morgan = require("morgan");
const path = require("path");
const router = require("./routes/router");
require("./database/database");
const app = express();

const PORT = process.env.PORT || 8080;
app.use(morgan("short"));
app.use(express.json());

// Serve the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1", router);
app.listen(PORT, () => console.log(`APP running on port ${PORT}`));
