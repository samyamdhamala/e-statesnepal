// const jwt = require('jsonwebtoken');

const Sequelize = require("sequelize");
const multer = require('multer');
const path = require('path');

// const moment = requirrre("moment");

//for image upload

const {sequelize,propertylist}=require("../../models");
const customer = require('../../models/customer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './images');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '--'+ file.originalname);
  
}
});

const upload = multer({
  storage: storage,
limits: {fileSize: '1000000'},
  fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png/;
      const mimeType = fileTypes.test(file.mimetype);
      const extname = fileTypes.test(path.extname(file.originalname))

      if (mimeType && extname) {
          return cb(null, true);
      }
      cb("Error: Images Only!");
  }
}).array('propertyImage',5);

const postProperty= async (req,res)=>{
       try{
         upload(req,res,async (err)=>{
          if(err){
            return res.status(400).json({
              message:"Failure",
            })
          } 
           const propertyLists = [];
           req.files.map((item)=>{
              propertyLists.push(item.path);
           })
          
          
          const reqObj={customer_id:req.decoded.id,image:JSON.stringify(propertyLists),...req.body};

           const newPropertyList = await propertylist.create(reqObj);
          
        if (!newPropertyList){
            return res.status(400).json({
                status:"Failure",
                message:"Something went wrong User"
            });
        }

       return res.status(200).json({
            message:"Success",
            data:newPropertyList
        });
           
         });
           
       }
       catch(err){
           console.log(err.message);
          return res.status(404).json({
               status:"Failure",
               message:"Something went wrong"
           });
       }
}

const getProperty = async(req,res)=>{    try{        const customer_id= req.decoded.id;        const properties = await propertylist.findAll({            where:{                customer_id: {                    [Sequelize.Op.ne]: customer_id,                  }            }              });
    
          if (!properties){
            return res.status(400).json({
                status:"Failure",
                message:"Something went wrong"
            });
        }
        res.json({message:"Success",data:properties});
      }
      catch(err){
        console.log(err.message);
        return res.status(404).json({
             status:"Failure",
             message:"Something went wrong"
         });
      }  
}

const getAllProperty = async (req,res)=>{
  try{
    const customer_id= req.decoded.id;
    const properties = await propertylist.findAll({
        where: {
          customer_id
        }
      });

      if (!properties){
        return res.status(400).json({
            status:"Failure",
            message:"Something went wrong"
        });
    }
    res.json({message:"Success",data:properties});
  }
  catch(err){
    console.log(err.message);
    return res.status(404).json({
         status:"Failure",
         message:"Something went wrong"
     });
  }
}

const patchProperty = async (req,res) => {
  try{
  const {customer_id, image, ...restBody}= req.body;

    const updatedProperty = await propertylist.update(
      restBody,
      {where: {
        id: parseInt(req.params.propertyId),
        customer_id:req.decoded.id
      }}
    );
    if (updatedProperty[0] === 0){
      return res.status(400).json({
        message:"Failure"
      });
    }
    return  res.status(200).json({
      message:"Success",
    });
  }
  catch(err){
    console.log(err.message);
    return res.status(404).json({
         status:"Failure",
         message:"Something went wrong"
     });
  }
};

const deleteProperty = async (req,res) => {
  try{
    const deletedProperty = await propertylist.destroy({
      where: {
        id: parseInt(req.params.propertyId),
        customer_id:req.decoded.id
      }

    });
    if (deletedProperty === 0){
      return res.status(400).json({
        message:"Failure"
      });
    }
    return  res.status(200).json({
      message:"Success",
    });
  }
  catch(err){
    console.log(err.message);
    return res.status(404).json({

          status:"Failure",
          message:"Something went wrong"
      });
  }
};


// //upload image controller
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'images');
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + '--'+ file.originalname);
    
// }
// });

// const upload = multer({
//     storage: storage,
//   limits: {fileSize: '1000000'},
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png/;
//         const mimeType = fileTypes.test(file.mimetype);
//         const extname = fileTypes.test(path.extname(file.originalname))

//         if (mimeType && extname) {
//             return cb(null, true);
//         }
//         cb("Error: Images Only!");
//     }
// }).array('image',5);

module.exports = {postProperty,getAllProperty,getProperty,patchProperty,deleteProperty};

