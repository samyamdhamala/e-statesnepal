const express = require("express");
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 4000;
const jwt = require("jsonwebtoken");

require("dotenv").config({path:"./.env"});

const userloginRoute = require('./routes/user/login');
const userregisterRoute = require('./routes/user/register');


//middleware

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json());

//routes

app.use('/user/login', userloginRoute);
app.use('/user/register', userregisterRoute);

app.use((req,res,next)=>{
    let token = req.headers.authorization;
    if (token){
        jwt.verify(token,process.env.SECRET,(err,decoded)=>{
            if (err){
                res.status(403).json({
                    success:false,
                    message:"Invalid Token supplied"
                })
            }else{
                req.decoded=decoded;
                next();
            }
        })
    }else{
        res.status(403).json({
            message:"Auth Token is not supplied"
        });
    }
});

app.use('/property', require("./routes/propertylist/getProperty"));

app.use('/like', require("./routes/like"));

app.use('/user', require("./routes/user/contact"));

app.use('/user/property', require("./routes/user/propertylist"));

//for search router
app.use('/search/property', require("./routes/search/search"));

//for favourites router
app.use('/favourite', require("./routes/favourite"));

//static images folder
app.use('/images', express.static('./images'));

//listen

app.listen(port, ()=>{
    console.log(`App listening at port: ${port}`);
})


