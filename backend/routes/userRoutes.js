const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const { check } = require("express-validator");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", [
    check('email').isEmail().withMessage('Please include a valid email'),
    check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], authUser);

module.exports = router;