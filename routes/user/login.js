const express = require("express");

const router = new express.Router();

const loginController = require('../../controllers/user/login');

router.post('/',loginController);

module.exports = router;