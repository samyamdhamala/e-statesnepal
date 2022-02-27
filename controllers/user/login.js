 const {User} = require("../../models/index");

 const jwt = require('jsonwebtoken');

 const Sequelize = require("sequelize");

 const login = async (req,res)=>{
        try{

            const user = await User.findOne({
                where:{
                    email:req.body.email
                }
            });

            if(user ===null || !await user.validPassword(req.body.password)){
                return res.status(404).json({
                    status:"Failure",
                    message:"Invalid Credentials"
                })
            }

            const token = jwt.sign(
                {
                    id:user.id,
                    email:user.email
                },
                process.env.SECRET,
                {expiresIn:"24h"}
            )


            res.status(200).json({
                message:"Success",
                user,
                token
            })

            
        }
        catch(err){
            console.log(err);
           return res.status(404).json({
                status:"Failure",
                message:"Something went wrong."
            });
        }
 }

 module.exports = login;