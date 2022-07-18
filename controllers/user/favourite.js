const jwt = require("jsonwebtoken");

const Sequelize = require("sequelize");

const moment = require("moment");

//controller to favourite a property
const {
  sequelize,
  User,
  Customer,
  Likes,
  Favourites,
  propertylist,
} = require("../../models");

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

// to favourite a property
const favouriteProperty = async (req, res) => {
  try {
    const propertyId = req.query.propertyId; 
    const hasfavourited = await Favourites.findOne({ //check if the property is already favourited
      where: {
        property_id: propertyId, 
        customer_id: req.decoded.id, 
      },
    });
    if (hasfavourited) { //if the property is already favourited
      const deletedfavourite = await Favourites.destroy({ //delete the favourite
        where: {
          property_id: propertyId,
          customer_id: req.decoded.id,
        },
      });
      return res.status(200).json({
        status: "Success",
        message: "You have deleted your favourite",
      });
    }
    const newfavourite = await Favourites.create({ //create a new favourite
      property_id: propertyId,
      customer_id: req.decoded.id,
    });
    return res.status(200).json({
      status: "success",
      message: "You have favourited this property",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};


const getfavouritedProperty = async (req, res) => {
  try {
    const customer_id = req.decoded.id;
    const favourites = await Favourites.findAll({
      where: { customer_id },
      raw:true,
      include: [
         propertylist,
      ]
      
    });
    if (!favourites) {
      return res.status(400).json({
        status: "Failure",
        message: "No property found",
      });
    }

     const requiredArr = favourites.map((item)=>{
      const {id, customer_id, property_id, createdAt, updatedAt, ...restObj} = item; 
      return restObj
     });

     const  modifiedArr = await Promise.all(requiredArr.map(async (item)=>{
      const likes = await getLikes(item["propertylist.id"]);
      const hasliked = await findIfLiked(item["propertylist.id"], customer_id);
      const isfavourited = await hasfavourited(item["propertylist.id"], customer_id);
      return {...item, likes, hasliked, isfavourited}
     }));

     const actualArr = modifiedArr.map((item)=>{
       return {
          id:item["propertylist.id"],
          customer_id:item["propertylist.customer_id"],
          name:item["propertylist.name"],
          description:item["propertylist.description"],
          streetaddress:item["propertylist.streetaddress"],
          city:item["propertylist.city"],
          state:item["propertylist.state"],
          province:item["propertylist.province"],
          area:item["propertylist.area"],
          price:item["propertylist.price"],
          image:item["propertylist.image"],
          type:item["propertylist.type"],
          status:item["propertylist.status"],
          latitude:item["propertylist.latitude"],
          longitude:item["propertylist.longitude"],
          createdAt:item["propertylist.createdAt"],
          updatedAt:item["propertylist.updatedAt"],
          likes:item.likes,
          hasBookmarked:item.isfavourited,
          hasLiked:item.hasliked,
       }
      });

    return res.status(200).json({
      message: "Success",
      data: actualArr,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};



module.exports = { favouriteProperty, getfavouritedProperty };
