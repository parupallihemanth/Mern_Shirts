const express = require('express');
const { signout, signup, signin, isSignin }  = require('../controllers/auth');
const router = express.Router();
const { check, validationResult } = require('express-validator');



router.post('/signup', [
    check("name", "Name should have minimum 3 char").isLength( { min : 3 }),
    check("email", "Email required").isEmail(),
    check("password","password should have minimum 3 char").isLength( { min : 3})
],signup);

router.post('/signin', [
    check("email", "Email required").isEmail(),
    check("password", "password required").isLength( { min : 3})
],signin);

router.get('/signout', signout)

// router.get('/testroute', isSignin, (req,res) =>{
//     res.json(req.auth)
//     res.send('protected route')
// })



module.exports = router