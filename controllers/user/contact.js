const {User} = require("../../models/index");

const Sequelize = require("sequelize");

const getContact = async (req, res) => {
   try{
  
    const user = await User.findOne({
        where: {
            id: req.params.id
        }});
    if (user === null) {
        return res.status(404).json({
            status: "Failure",
            message: "User not found"
        });
    }
    console.log(user);
    const {role, createdAt, updatedAt,password, ...restObj}= user.dataValues;
    res.status(200).json({
        status: "Success",
        user:restObj});
   }
   catch(err){
       console.log(err);
       return res.status(400).json({
           status: "Failure",
              message: "Something went wrong"
       });
   }
}

module.exports = {getContact}