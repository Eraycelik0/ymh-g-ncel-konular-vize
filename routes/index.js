const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Login Sayfası
router.get("/login", (req, res) => res.render("login"));

// Register Sayfası
router.get("/register", (req, res) => res.render("register"));

// Kullanıcı Kaydı
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        req.flash("success_msg", "Kayıt başarılı, giriş yapabilirsiniz!");
        res.redirect("/login");
    } catch (error) {
        req.flash("error_msg", "Hata oluştu. Lütfen tekrar deneyin.");
        res.redirect("/register");
    }
});

// Login İşlemi
router.post("/", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
        req.session.user = user;
        res.redirect("/dashboard");
    } else {
        req.flash("error_msg", "Geçersiz e-posta veya şifre");
        res.redirect("/login");
    }
});

// Dashboard
router.get("/dashboard", (req, res) => {

    res.render("dashboard", { user: req.session.user });
});

// Çıkış
router.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
});

module.exports = router;
