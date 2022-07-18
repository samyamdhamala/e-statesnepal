const express = require("express");

const router = new express.Router();

const favouriteController = require("../../controllers/user/favourite");

//route to favourite porperty
router.route("/").post(favouriteController.favouriteProperty).get(favouriteController.getfavouritedProperty);

module.exports = router;
