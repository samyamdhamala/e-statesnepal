const express = require("express");

const router = new express.Router();

const searchController = require("../../controllers/user/search");

router.route("/list").get(searchController.getSearchedProperty);

router.route("/").get(searchController.getAllCity);

module.exports = router;



