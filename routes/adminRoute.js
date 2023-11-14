const express = require('express')
const admin_route = express();
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

admin_route.use(flash());

const config = require("../config/config")
const seCode = config.sessionSecret;

const auth = require("../middleware/adminAuth")

admin_route.use(session({
    secret:seCode,
    resave:false,
    saveUninitialized:false
}))

const adminController = require('../controllers/adminController');
const { isLogout, isLogin } = require('../middleware/adminAuth');

admin_route.use(express.urlencoded({extended: true}));
admin_route.use(express.json())

admin_route.set('view engine','ejs')
// admin_route.set('views','./views/admin');
admin_route.set('views', path.join(__dirname, '../views/admin'));//path of View files 

admin_route.get('/',auth.isLogout,adminController.loadLogin)

admin_route.post('/',adminController.verifyLogin)

admin_route.get('/home',auth.isLogin,adminController.loadHome)

admin_route.get('/logout',auth.isLogin,adminController.logoutAdmin)

admin_route.get('/dashboard',auth.isLogin,adminController.loadDashboard)

admin_route.get('/editAdminDetails',auth.isLogin,adminController.editAdminDetails)

admin_route.post('/editAdminDetails',auth.isLogin,adminController.editAdminDetailsUpdate)

admin_route.get('/newUser',auth.isLogin,adminController.newUserLoad)

admin_route.post('/newUser',adminController.addNewUser)

admin_route.get('/edituser',auth.isLogin,adminController.editUserDetailsLoad)

admin_route.post('/edituser',auth.isLogin,adminController.editUserDetailsUpdate)

admin_route.get('/deleteUser',auth.isLogin,adminController.deleteUser)

admin_route.get('*',(req,res)=>{
    res.redirect('/admin')
})


module.exports = admin_route