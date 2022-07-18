// const jwt = require('jsonwebtoken');

const Sequelize = require("sequelize");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const moment = requirrre("moment");

//for image upload
const { sequelize, propertylist, Likes, Favourites } = require("../../models");
const customer = require("../../models/customer");

//middleware for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      //unique file name for each image
      Date.now() + "-" + req.decoded.id + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" }, //1mb
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/; //allowed file types
    const mimeType = fileTypes.test(file.mimetype); //check file type
    const extname = fileTypes.test(path.extname(file.originalname)); //check extension

    //check mime and extension
    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Error: Images Only!");
  },
}).array("propertyImage", 10); //max 10 images


// get total likes
const getLikes = async (propertyId) => { 
  const likes = await Likes.count({ 
    where: {
      property_id: propertyId, //get likes for specific property
    },
  });

  return likes;  //return total likes
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


const postProperty = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({
          message: "Failure",
        });
      }
      const propertyLists = [];
      // const propertyList = req.file.path;
      req.files.map((item) => {
        let imagePath = item.path.replace(/\\/g, "/");

        propertyLists.push(imagePath);
      });

      const reqObj = {
        customer_id: req.decoded.id,
        image: JSON.stringify(propertyLists),
        ...req.body,
      };

      const newPropertyList = await propertylist.create(reqObj);

      if (!newPropertyList) {
        return res.status(400).json({
          status: "Failure",
          message: "Something went wrong User",
        });
      }

      return res.status(200).json({
        message: "Success",
        data: newPropertyList,
      });
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};


     



const getProperty = async (req, res) => {
  try {
    console.log("------------------------");
    const customer_id = req.decoded.id;
    const properties = await propertylist.findAll({
      order: [["createdAt", "DESC"]],
      where: { customer_id: { [Sequelize.Op.ne]: customer_id } },
    });

    if (!properties) {
      return res.status(400).json({
        status: "Failure",
        message: "Something went wrong",
      });
    }

    var results = await Promise.all(
      properties.map(async (item) => {
        const requiredItem = item.dataValues;
        const likes = await getLikes(item.id);
        const hasLiked = await findIfLiked(item.id, customer_id);
        const hasBookmarked = await hasfavourited(item.id, customer_id);
        // console.log({ ...requiredItem, likes });
        return { ...requiredItem, likes, hasLiked, hasBookmarked };
      })
    );

    res.json({ message: "Success", data: results });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};

const getAllProperty = async (req, res) => {
  try {
    const customer_id = req.decoded.id;
    let properties = await propertylist.findAll({
      order: [["createdAt", "DESC"]],
      where: {
        customer_id,
      },
    });

    if (!properties) {
      return res.status(400).json({
        status: "Failure",
        message: "Something went wrong",
      });
    }

    var results = await Promise.all(
      properties.map(async (item) => {
        const requiredItem = item.dataValues;
        const likes = await getLikes(item.id);
        const hasLiked = await findIfLiked(item.id, customer_id);
        const hasBookmarked = await hasfavourited(item.id, customer_id);
        return { ...requiredItem, likes, hasLiked , hasBookmarked};
      })
    );

    res.json({ message: "Success", data: results });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};

const patchProperty = async (req, res) => {
  try {
    const { customer_id, image, ...restBody } = req.body;

    const updatedProperty = await propertylist.update(restBody, {
      where: {
        id: parseInt(req.params.propertyId),
        customer_id: req.decoded.id,
      },
    });
    if (updatedProperty[0] === 0) {
      return res.status(400).json({
        message: "Failure",
      });
    }
    return res.status(200).json({
      message: "Success",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await propertylist.findOne({
      where: {
        customer_id: req.decoded.id,
        id: parseInt(req.params.propertyId),
      },
    });

    if (!property) {
      return res.status(400).json({
        status: "Failure",
        message: "Property not found",
      });
    }

    const images = JSON.parse(property.dataValues.image);

    images.map((imagePath) => {
      fs.unlink(imagePath, (err) => {
        if (err) throw err;
      });
    });

    const deletedProperty = await propertylist.destroy({
      where: {
        id: parseInt(req.params.propertyId),
        customer_id: req.decoded.id,
      },
    });
    if (deletedProperty === 0) {
      return res.status(400).json({
        message: "Failure",
      });
    }

    return res.status(200).json({
      message: "Success",
      property,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};

//get ptoperty and filter by type
const getPropertyByType = async (req, res) => {
  try {
    const customer_id = req.decoded.id;
    const type = req.query.type;
    const properties = await propertylist.findAll({
      order: [["createdAt", "DESC"]],
      where: { customer_id: { [Sequelize.Op.ne]: customer_id } , type: {[Sequelize.Op.like]: `%${type}%`}},
    });

    if (!properties) {
      return res.status(400).json({
        status: "Failure",
        message: "Something went wrong",
      });
    }

    var results = await Promise.all(
      properties.map(async (item) => {
        const requiredItem = item.dataValues;
        const likes = await getLikes(item.id);
        const hasLiked = await findIfLiked(item.id, customer_id);
        const hasBookmarked = await hasfavourited(item.id, customer_id);
        return { ...requiredItem, likes, hasLiked , hasBookmarked};
      })
    );
    
    res.json({ message: "Success", data: results });
  } catch (err) {
    console.log(err.message);
    return res.status(404).json({
      status: "Failure",
      message: "Something went wrong",
    });
  }
};

module.exports = {
  postProperty,
  getAllProperty,
  getProperty,
  patchProperty,
  deleteProperty,
  getPropertyByType,
};
