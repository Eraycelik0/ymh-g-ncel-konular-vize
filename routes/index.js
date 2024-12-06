const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Login Sayfası
router.get("/login", (req, res) => {
    res.render("login");
});

// Register Sayfası
router.get("/register", (req, res) => {
    res.render("register");
});

// Kullanıcı Kaydı
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Kullanıcının zaten mevcut olup olmadığını kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash("error_msg", "Bu e-posta zaten kullanılıyor.");
            return res.redirect("/register");
        }

        // Şifreyi hashle ve kullanıcıyı oluştur
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        req.flash("success_msg", "Kayıt başarılı, giriş yapabilirsiniz!");
        res.redirect("/login");
    } catch (error) {
        console.error("Kayıt sırasında hata:", error);
        req.flash("error_msg", "Hata oluştu. Lütfen tekrar deneyin.");
        res.redirect("/register");
    }
});

// Login İşlemi
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.user = { id: user._id, name: user.name, email: user.email };
            res.redirect("/dashboard");
        } else {
            req.flash("error_msg", "Geçersiz e-posta veya şifre.");
            res.redirect("/login");
        }
    } catch (error) {
        console.error("Giriş sırasında hata:", error);
        req.flash("error_msg", "Bir hata oluştu. Lütfen tekrar deneyin.");
        res.redirect("/login");
    }
});

// Dashboard
router.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        req.flash("error_msg", "Lütfen önce giriş yapın.");
        return res.redirect("/login");
    }
    res.render("dashboard", { user: req.session.user });
});

// Çıkış
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Çıkış sırasında hata:", err);
            req.flash("error_msg", "Çıkış yapılırken bir hata oluştu.");
            return res.redirect("/dashboard");
        }
        res.redirect("/login");
    });
});

module.exports = router;
