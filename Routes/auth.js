const express = require("express");
const router = express.Router();

const auth = require("../middleware/verifyToken");
const UserController = require("../controllers/user");

router.get("/:id", auth, UserController.getUserById);

router.post("/login", UserController.login);

router.post("/signup", UserController.signup);

module.exports = router;
