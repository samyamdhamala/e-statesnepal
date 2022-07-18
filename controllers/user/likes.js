const jwt = require("jsonwebtoken");

const Sequelize = require("sequelize");

const moment = require("moment");

const { sequelize, User, Customer, Likes } = require("../../models");

// controller to like a property
const likePost = async (req, res) => { 
  try {
    const reqObj = req.body;
    const propertyId = req.query.propertyId;

    const hasLiked = await Likes.findOne({ // check if user has liked the property
      where: {
        property_id: propertyId,
        customer_id: req.decoded.id,
      },
    });

    if (hasLiked) {
      const deletedLike = await Likes.destroy({ // delete like if user has liked the property
        where: {
          property_id: propertyId,
          customer_id: req.decoded.id,
        },
      });
      return res.status(200).json({
        status: "Success",
        message: "You have deleted your like",
      });
    }

    const newLike = await Likes.create({ // create a new like
      property_id: propertyId,
      customer_id: req.decoded.id,
    });
    return res.status(200).json({
      status: "success",
      message: "You have liked this property",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};



module.exports = { likePost};
