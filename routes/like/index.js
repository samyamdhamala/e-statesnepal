const express = require("express");

const router = new express.Router();

const likeController = require("../../controllers/user/likes");

router.route('/').post(likeController.likePost);

module.exports = router;