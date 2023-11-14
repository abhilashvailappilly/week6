const User = require("../models/userModal")
const bcrypt = require('bcrypt')


const securePassword = async(password)=>{

    try{
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){
        console.log(error.message)
    }
}

const loadLogin = async(req,res)=>{
    try{
        res.render('login')
    }catch(error){
        console.log(error.message)
    }
}

const verifyLogin = async(req,res)=>{

    try{
        
        const email =req.body.email;
        const password = req.body.password;

       adminData = await User.findOne({email:email})

       if(adminData){
       const passMatch = await bcrypt.compare(password,adminData.password)
        if(passMatch){

            if(adminData.is_admin === 0){
                res.render('login',{message:" password is incorrect"})

            }else{
                req.session.admin_id = adminData._id;
                res.redirect("/admin")
            }

        }else{
        res.render('login',{message:" password is incorrect"})
    }
       }else{
        res.render('login',{message:" password is incorrect"})
    }

    }catch(error){
        console.log(error.message)
    }
}

const loadHome = async(req,res)=>{

    try{
        const adminData = await User.findById({_id:req.session.admin_id});
        res.render('home',{admin:adminData});
        // res.send("bdbkjsdhj")

    }catch(error){
        console.log(error.message)
    }
}

const logoutAdmin = async(req,res)=>{

    try{
        req.session.destroy();
        res.redirect('/admin');

    }catch(error){
        console.log(error.message)
    }
}

const loadDashboard = async(req,res)=>{

    try{

        var search = '';
        if(req.query.search){
            search = req.query.search;
        }


        const usersData = await User.find({is_admin:0,
        
            $or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}}
            ]

        });
        res.render('dashboard',{users:usersData})
    }catch(error){
        console.log(error.message)
    }
}


const newUserLoad = async(req,res)=>{

    try{
        res.render('newUser')
    }catch(error){
        console.log(error.message)
    }
}

const addNewUser = async(req,res)=>{
    const spass = await securePassword(req.body.password)

    try{
        const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:spass,
            is_admin:0
        })

        const userData = await newUser.save();

        if(userData){
            res.render('newUser',{message : "Sucessfully Registered"});
        }else{
            res.render('newUser',{message : "Registration failed."});

        }

    }catch(error){
        console.log(error.message)
    }
}

const editUserDetailsLoad = async(req,res)=>{

    const userId = await req.query.id;

    try{
        const userData = await User.findById({_id:userId})
        res.render('editUser',{user:userData})
        // console.log(userId);
    }catch(error){
        console.log(error.message)
    }
}

const editUserDetailsUpdate = async(req,res)=>{

    try{
        
        const userUpdateData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile,is_admin:req.body.is_admin}})

        if(userUpdateData){
            // res.render('home',{User:userData})
            res.redirect('/admin/dashboard')
            console.log("user data available")
        }else{
            res.render('/editUser')
            console.log("user data not available")

        }


    }catch(error){
        console.log(error.message)
    }
}

const deleteUser = async(req,res)=>{

    try{
        const id =  req.query.id
        const userdata = await User.deleteOne({_id:id})
        // req.flash('success', 'Message to display on the next page');

        res.redirect('/admin/dashboard')
        // const message = "User deleted Sucessfully"
        // res.redirect(`/admin/dashboard?message=${message}`)
      

    }catch(error){
        console.log(error.message)
    }
}

const editAdminDetails = async(req,res)=>{

    try{

        
        const adminData = await User.findById({_id:req.query.id})
        const spass = await bcrypt(adminData.password)
        // console.log("crypted password:",spass)
        // const passwordMatch = await  bcrypt.(password,userData.password);

        console.log(adminData)
        res.render('editAdmin',{admin:adminData})

    }catch(error){
        console.log(error.message)
    }

}

const editAdminDetailsUpdate = async(req,res)=>{

    try{
    const spass = await securePassword(req.body.password)

        const adminId = req.body.admin_id;

        const updateAdminData = await User.findByIdAndUpdate({_id:adminId},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile,password:spass}})

        if(updateAdminData){
            // res.render('home',{User:userData})
            res.redirect('/admin/home')
        }else{
            res.render('editAdmin')
        }

    }catch(error){
        console.log(error.message)
    }
}



module.exports= {
    loadLogin,
    verifyLogin,
    loadDashboard,
    loadHome,
    logoutAdmin,
    newUserLoad,
    addNewUser,
    editUserDetailsLoad,
    editUserDetailsUpdate,
    deleteUser,
    editAdminDetails,
    editAdminDetailsUpdate
}