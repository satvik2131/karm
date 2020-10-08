const express = require('express');
const router = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken');
const session = require('express-session'); 


//Middleware for sessions
router.use(
    session({
      key: "user_sid",
      secret: "somerandonstuffs",
      resave: false,
      saveUninitialized: false,
      
    })
  );



// router.use((req,res,next)=>{
//     req.session.token;
//     next();
// })

router.get('/',async (req,res)=>{
    res.render('index',{
        title:'Home'
    });
})

//Register route
router.get('/register',async (req,res)=>{
    res.render('register',{
        title:'Register',
        message:'Successful'
    })
})

//validation of register form
router.post('/register', async (req,res)=>{
    
    const values = Object.keys(req.body)

    const password =  req.body.password
    const confirmPassword =  req.body.confirm_password
    
    try{
        if(!(password === confirmPassword)){
            throw new Error('password not matched')
        }

        values.forEach((value)=>{
            User[value] = req.body[value]
        })

        const user =  await User(req.body)
        await user.save()


        //Flash Messages without extra modules
        //Success 
        res.render('register',{
            title:'Register',
            message:'success'
        })  

    }catch(e){
        //Failure
        res.render('register',{
            title:'Register',
            message:'fail'
        })
    }    
})

//LOGIN
router.get('/login', (req,res)=>{
    res.render('login',{
        title:'login',
        message:'welcome'
    })
})

//LOGIN VALIDATION
router.post('/login', async function(req,res,next){

    try{
        const user = await User.findOne({email: req.body.Email})
         
        if(!user){
            throw new Error('unable to login')
        }

        const passResult = await bcrypt.compare(req.body.password,user.password)
        
        if(!passResult){
            throw new Error('unable to login')
        }

        const token = await user.getAuthTokens();
        req.session.token = await token;
        res.redirect('/profile');
        
    }catch(e){

       console.log(e)
       res.render('login',{
           title:'login',
           message:'invalid'
       })
    }
})

router.get('/profile' , auth ,async (req,res)=>{ 
    try{
        res.render('profile',{
            title:'profile',
            name: req.user.first_name
        })

    }catch(e){
        console.log(e)
    }

})

router.get('/logout', auth ,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.redirect('/login')

    }catch(e){
        res.status(500).send()
    }
    
});

router.get('/profile/cart', auth ,async (req,res,next)=>{
    if(!req.user){
        return res.redirect('/login');
    }

    res.render('cart',{
        title:'Product',
    })
})




//Exports
module.exports= router;