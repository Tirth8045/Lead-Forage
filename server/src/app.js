const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo").MongoStore;
const passport = require("./config/passport");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const leadRoutes = require("./routes/lead");
const contactRoutes = require("./routes/contact");
const pipelineRoutes = require("./routes/pipeline");
const followUpRoutes = require("./routes/followUp");
const noteRoutes = require("./routes/note");
const settingRoutes = require("./routes/setting");
const dashboardRoutes = require("./routes/dashboard");
const errorHandler = require("./middleware/error");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/pipeline", pipelineRoutes);
app.use("/api/follow-ups", followUpRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    res.send("CRM Backend Running");
});

app.use(errorHandler);

module.exports = app;
