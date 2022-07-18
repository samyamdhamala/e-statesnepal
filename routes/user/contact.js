const express = require("express");

const router = new express.Router();

const contactController = require("../../controllers/user/contact");

router.route('/info/:id').get(contactController.getContact);

module.exports = router;