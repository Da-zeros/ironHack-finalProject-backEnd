require("dotenv/config");
require("./db");
const express = require("express");

const { isAuthenticated } = require("./middleware/jwt.middleware"); // <== IMPORT


const app = express();
require("./config")(app);

const cloudinary = require ("./config/cloudinary")


// 👇 MIDDLEWARE MISSING
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const authRouter = require("./routes/auth.routes");
app.use("/api/auth", authRouter);

const userDashboard = require("./routes/userDashboard.routes");
app.use("/api",isAuthenticated, userDashboard);            // <== UPDATE

const activitiesRouter = require("./routes/activities.routes")
app.use("/api",isAuthenticated, activitiesRouter)

const chatRouter = require("./routes/chat.routes");
app.use("/api/chat",isAuthenticated, chatRouter); 


module.exports = app;
