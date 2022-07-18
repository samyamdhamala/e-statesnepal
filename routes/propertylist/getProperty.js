const express = require("express");

const router = new express.Router();

const propertyController = require('../../controllers/user/propertylist');

router.route('/').get(propertyController.getProperty);

router.route('/list').get(propertyController.getPropertyByType);

module.exports = router;