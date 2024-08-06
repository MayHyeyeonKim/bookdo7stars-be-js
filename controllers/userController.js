var express = require('express');
//var session = require('express-session');
var bodyParser = require('body-parser');
const User = require('../models/user');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.post('/users', async function (req, res) {
  //회원가입 로직 만들기
  const {
    name,
    email,
    password,
    mobile,
    policyyn,
    grade,
    recipient,
    post_code,
    address,
    address_detail,
    adminyn,
    status,
  } = req.body;
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      mobile,
      policyyn,
      grade,
      recipient,
      post_code,
      address,
      address_detail,
      adminyn,
      status,
    });
    res.status(201).json({ userId: newUser.id, message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err.message);
    res.status(500).json({ message: 'Error registering user' });
  }
  res.send(200);
});

module.exports = router;
