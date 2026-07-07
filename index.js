const express = require("express");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const dotenv = require("dotenv");
const notFound = require("./middleware/notFound.middleware");
const sendCustomResponse = require("./middleware/customResponse.middleware");
const connectDB = require("./config/connectDb");
const { globalErrorHandler } = require("./middleware/globalErrorHandler.middleware");
const router = require("./routes/index.routes");

dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

/* -------------------- CORS FIX (Express 5 Compatible) -------------------- */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight Request is handled by the cors() middleware above.

/* -------------------- Other Middlewares -------------------- */

app.use(compression());
app.use(cookieParser());
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Custom response handler
app.use(sendCustomResponse);

// API routes
app.use("/api/v1", router);

// Default route
app.get("/", (req, res) => {
  res.send("Coral Group APIs Live");
});


// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/brochure", express.static(path.join(__dirname, "BROCHURE")));
app.use("/logo", express.static(path.join(__dirname, "logo")));
app.use("/image", express.static(path.join(__dirname, "image")));

// 404 handler
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

/* -------------------- Server Start -------------------- */

const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});







