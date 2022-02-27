const express = require("express");

const router = new express.Router();

const registerController = require('../../controllers/user/register');

router.post('/',registerController);

module.exports = router;