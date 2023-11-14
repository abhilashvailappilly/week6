const mongoose = require("mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/userManagement")
const path = require('path')
const express = require("express");
const app = express();
const nocache=require('nocache')

app.use(nocache())


app.set('view engine','ejs')
app.use( express.urlencoded({ extended: true }));
    
app.use(express.json());

// // Middleware to set Cache-Control headers for all  responses
// app.use((req, res, next)=> {
//     res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
//     res.header('Pragma', 'no-cache');//Cache-Control: no-cache and Pragma: no-cache, you ensure that this data is not stored in the client's cache
//     res.header('Expires', '0');
//     next();
// });


//load static file
app.use('/static',express.static(path.join(__dirname,'public')) )

//for user router
const userRoute = require('./routes/userRoute')
app.use('/',userRoute);
 
// FOR ADMIN ROUTER
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute);

app.get('*',(req,res)=>{
    res.status(404).send('404 - Not Found');
})




// admin_route.get('*',(req,res)=>{
//     res.redirect('/admin')
// })

app.listen(3000,()=>{
    console.log("server is running.......");
});