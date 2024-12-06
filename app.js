require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const app = express();

// Statik Dosyalar
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB bağlantısı başarılı"))
    .catch(err => console.error("MongoDB bağlantı hatası:", err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

// Flash Message Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.user = req.session.user || null; // Kullanıcıyı her template'te erişilebilir yapar
    next();
});

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rotalar
app.use("/", require("./routes/index"));

// Vercel için uygulamayı dışa aktar
module.exports = app;
