const express = require('express')
const user_route = express();
const path = require('path');
const session = require('express-session');

const config = require("../config/config")
const seCode = config.sessionSecret;
user_route.use(session({
    secret:seCode,
    resave:false,
    saveUninitialized:false
}))

const auth = require("../middleware/auth")

// for exp purpose i just mentioned view type in index.js file
// user_route.set('view engine','ejs')
// user_route.set('views','./views/users')
user_route.set('views', path.join(__dirname, '../views/users'));//path of View files 
user_route.use(express.urlencoded({extended: true}));
user_route.use(express.json())


const userController = require("../controllers/userController")

user_route.get('/register',auth.isLogout,userController.loadRegister);

user_route.post('/register',userController.insertUser);

user_route.get('/',auth.isLogout,userController.loginLoad);
// user_route.get('/',auth.isLogin,userController.loadHome);//i added
user_route.get('/login',auth.isLogout,userController.loginLoad);
user_route.post('/login',userController.verifyLogin);
user_route.get('/home',auth.isLogin,userController.loadHome);
user_route.get('/logout',auth.isLogin,userController.userLogout)
user_route.get('/edit',auth.isLogin,userController.editProfile)
user_route.post('/edit',userController.updateProfile)
// user_route.get('*',(req,res)=>{
//     res.redirect('/')
// })

// user_route.get('/route/:email',(req,res)=>{
//     const userId = req.params.email;
//     console.log(userId)
//     if(userId == 1){
//         res.end(`email = ${userId}`)
//     }else{
//         res.end(`email not vailid`)

//     }
// })



module.exports = user_route