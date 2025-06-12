const express = require("express");
const morgan = require("morgan");
const path = require("path");
const router = require("./routes/router");
const cors = require("cors");

const app = express();

// Cloud Run provides PORT as an environment variable
const PORT = process.env.SERVERPORT || 3001;

app.use(morgan("short"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// Serve the uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1", router);

app.listen(PORT, () => console.log(`APP running on port ${PORT}`));
