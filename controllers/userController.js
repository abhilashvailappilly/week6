const User = require('../models/userModal')
const bcrypt = require('bcrypt');

const securePassword = async(password)=>{

    try{
        const passwordHash = await bcrypt.hash(password,10);
        
        return passwordHash;
    }catch(error){
        console.log(error.message)
    }
}

const loadRegister = async(req,res)=>{

    try{
        res.render('registration');
    }catch(error){
        console.log(error.message);
    }

}
const insertUser = async(req,res)=>{
    const spass = await securePassword(req.body.password)
    try{
      const user = new  User({
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        password:spass,
        is_admin:0

        });

        const userData = await user.save();

        if(userData){
            res.render('registration',{message : "Sucessfully Registered"});
        }else{
            res.render('registration',{message : "Registration failed."});

        }

    }catch(error){
        console.log(error.message)
    }
}


// login user methods started

// i remove async infront of the arrow function
const loginLoad = (req,res)=>{

    try{
        res.render('login')
    }catch(error){
        console.log(error.message)
    }
}



const verifyLogin = async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({email:email})

        if(userData){

          const passwordMatch = await  bcrypt.compare(password,userData.password);
          if(passwordMatch){
            req.session.user_id = userData._id;
            res.redirect('/home');
          }else{
            console.log(userData.password)
            console.log(password)
            res.render('login',{message:" password is incorrect"})
           

          }

        }else{
            res.render('login',{message:"Email and password is incorrect"})
        }

    }catch(error){
        console.log(error.message)
    }
}

const loadHome = async(req,res)=>{

    try{
       const userData = await User.findById({_id:req.session.user_id})
        res.render('home',{User:userData});
    }catch(error){
        console.log(error.message)
    }
}


// i remove async infront of the arrow function

const userLogout = (req,res)=>{
    try{

        req.session.destroy();
        res.redirect('/');

    }catch(error){
        console.log(error.message);
    }
}

const editProfile = async(req,res)=>{
    try{

        const id = req.query.id;

        const userData = await User.findById({_id:id});
       
        if(userData){
            res.render('edit',{user:userData})
        }

    }catch(error){
        console.log(error.message)
    }
}


const updateProfile = async(req,res)=>{

    try{

    const spass = await securePassword(req.body.password)

        const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile,password:spass}})

        if(userData){
            // res.render('home',{User:userData})
            res.redirect('/home')
        }else{
            res.render('register')
        }

    }catch(error){
        console.log(error.message);
    }
}

module.exports = {
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editProfile,
    updateProfile
}