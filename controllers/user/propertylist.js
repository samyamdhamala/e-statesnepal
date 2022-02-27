const jwt = require('jsonwebtoken');

const Sequelize = require("sequelize");

const moment = require("moment");

const {sequelize,propertylist}=require("../../models");
const customer = require('../../models/customer');

const postProperty= async (req,res)=>{
       try{
         console.log(req.body);
           const reqObj={customer_id:req.decoded.id,...req.body};

           const newPropertyList = await propertylist.create(
            reqObj
        );
          
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
           
       }
       catch(err){
           console.log(err.message);
          return res.status(404).json({
               status:"Failure",
               message:"Something went wrong"
           });
       }
}

const getProperty = async(req,res)=>{
    try{
        const customer_id= req.decoded.id;
        const properties = await propertylist.findAll({
            where:{
                customer_id: {
                    [Sequelize.Op.ne]: customer_id,
                  }
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

module.exports = {postProperty,getAllProperty,getProperty};