const jwt = require('jsonwebtoken');

const Sequelize = require("sequelize");

const moment = require("moment");

const {sequelize,User,Customer}=require("../../models");

const register= async (req,res)=>{
       try{
           const reqObj=req.body;
           const emailExists = await User.findOne({
               where:{email:reqObj.email},
           });

           if(emailExists){
               return res.status(300).json({
                   status:"Failure",
                   message:"Email must be unique"
               });
           }

           const phoneNumberExists = await User.findOne({
            where:{phonenumber:reqObj.phonenumber},
            });

        if(phoneNumberExists){
            return res.status(300).json({
                status:"Failure",
                message:"Phone must be unique"
            });
        }

        const tr = await sequelize.transaction({autocommit:true});

        const user = await User.create(
            {email:reqObj.email,
            firstName:reqObj.firstname,
            lastName:reqObj.lastname,
            password:reqObj.password,
            phonenumber:reqObj.phonenumber,
            role:"customer"
            },{
                transaction: tr
            }
        );

        if (!user){
            await tr.rollback();
            return res.status(400).json({
                status:"Failure",
                message:"Something went wrong User"
            });
        }

        console.log("CREATED USER ID",user.dataValues);

        const customer = await Customer.create({
            id:user.dataValues.id,
            state:reqObj.state,
            occupation:reqObj.occupation,
            dob:moment(reqObj.dob).format("YYYY-MM-DD").toString()
        },{
            transaction: tr
        });

        if (!customer){
            await tr.rollback();
            return res.status(400).json({
                status:"Failure",
                message:"Something went wrong Customer"
            });
        };

        await tr.commit();
        const token = jwt.sign(
            {
                id:user.id,
                email:user.email
            },
            process.env.SECRET,
            {expiresIn:"24h"}
        )


       return res.status(200).json({
            message:"Success",
            user,
            token
        })


           
       }
       catch(err){
           console.log(err.message);
          return res.status(404).json({
               status:"Failure",
               message:"Something went wrong"
           });
       }
}

module.exports = register;