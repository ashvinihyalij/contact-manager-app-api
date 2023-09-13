const express = require("express");
const router = express.Router();
const {
    register,
    login,
    current
} = require("../controllers/userController");
const validateToken = require('../middleware/validateTokenHandler');

router.post("/register", register);

router.post("/login", login);

router.get("/current", validateToken, current);

module.exports = router;