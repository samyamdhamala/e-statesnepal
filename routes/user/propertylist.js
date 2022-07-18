const express = require("express");

const router = new express.Router();

const propertyController = require('../../controllers/user/propertylist');

router.route('/').post(propertyController.postProperty).get(propertyController.getAllProperty);

router.route("/:propertyId").patch(propertyController.patchProperty).delete(propertyController.deleteProperty);
module.exports = router;