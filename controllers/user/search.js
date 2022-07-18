const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const { sequelize, propertylist, Likes, Favourites } = require("../../models");
const customer = require("../../models/customer");

//get likes favourites count
const getLikes = async (propertyId) => {
  const likes = await Likes.count({
    where: {
      property_id: propertyId,
    },
  });

  return likes;
};

const hasfavourited = async (propertyId, userId) => {
  const favouriteStatus = await Favourites.findOne({
    where: {
      property_id: propertyId,
      customer_id: userId,
    },
  });

  if (favouriteStatus) {
    return true;
  }

  return false;
};

const findIfLiked = async (propertyId, userId) => {
  const likes = await Likes.findOne({
    where: {
      property_id: propertyId,
      customer_id: userId,
    },
  });

  if (likes) {
    return true;
  }

  return false;
};

// controller to get property search by city
const getSearchedProperty = async (req, res) => {
  try {
    const customer_id = req.decoded.id;
    const keyword = req.query.keyword;
    const properties = await propertylist.findAll({ //get all properties
      //search by city or streetaddress
      where: {[Sequelize.Op.or]: [{city: {[Sequelize.Op.like]: `%${keyword}%`}}, {streetaddress: {[Sequelize.Op.like]: `%${keyword}%`}}]},  
    }); 
    if (!properties) {
      return res.status(400).json({
        status: "Failure",
        message: "No property found",
      });
    }

    //get likes and favourites count with data
    var results = await Promise.all( 
      properties.map(async (item) => {
        const requiredItem = item.dataValues;
        const likes = await getLikes(item.id);
        const hasLiked = await findIfLiked(item.id, customer_id);
        const hasBookmarked = await hasfavourited(item.id, customer_id);
        return { ...requiredItem, likes, hasLiked, hasBookmarked };
      })
    );
    return res.status(200).json({
      message: "Success",
      data: results,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};

//get list of all city column values from propertylists
const getAllCity = async (req, res) => {
  try {
    const properties = await propertylist.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("city")), "city"]],
    });
    if (!properties) {
      return res.status(400).json({
        status: "Failure",
        message: "No property found",
      });
    }
    return res.status(200).json({
      message: "Success",
      data: properties,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};

module.exports = { getSearchedProperty, getAllCity };
