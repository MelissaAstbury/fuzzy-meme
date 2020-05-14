const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { userValidation } = require("../validation");
const config = require("../config");

exports.signup = async (req, res) => {
  const { error } = userValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //Check if user is already in the Database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("Email already exists");
  }

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //Create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({
      message: "You have created an account",
      user: savedUser._id,
    });
  } catch (err) {
    res.json({ message: err });
  }
};

exports.login = async (req, res) => {
  const { error } = userValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Password or Email");

  //Check if password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password or Email");

  //Create and assign jwt token
  const token = jwt.sign({ _id: user._id }, config.secret, {
    expiresIn: "1hr",
  });
  res.header("auth-token", token).send(token);
};

exports.getUserById = async (req, res) => {
  const param = req.params.id;
  try {
    const user = await User.findById(param);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
};
