const express = require("express");
const router = express.Router();

const UserController = require("../Controllers/user");

router.get("/:id", UserController.getRegisteredUserById);

router.post("/", UserController.register);

module.exports = router;
