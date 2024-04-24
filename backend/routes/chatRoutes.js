const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, removeFromGroup, addToGroup, renameGroup } = require("../controllers/chatControllers");
const { check } = require("express-validator");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, [
    check('name').not().isEmpty().trim().escape().withMessage('Chat name is required'),
    check('users.*').isMongoId().withMessage('Invalid user ID')
], createGroupChat);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
router.route("/rename").put(protect, renameGroup);

module.exports = router;