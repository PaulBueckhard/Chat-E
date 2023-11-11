const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
const { body, validationResult } = require('express-validator');

const router = express.Router();

router.route("/").get(protect, allUsers);
router.post("/",
    [
        body('name').not().isEmpty().trim().escape(),
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 })
    ],
    registerUser
);
router.post("/login",
    [
        body('email').isEmail().normalizeEmail(),
        body('password').isLength({ min: 6 })
    ],
    authUser
);

module.exports = router;