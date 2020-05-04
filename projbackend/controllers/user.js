const User = require('../modals/user');
const Order = require('../modals/order');

exports.getUserById = ( req, res, next, id) =>{
    User.findById(id).exec( (err, user) =>{
        if( err || !user){
            return res.status(400).json({
                error : "user not found in database"
            })
        }

        req.profile = user;
        next();

    })
}


exports.getUser = (req, res) =>{
    
    // Here this request sends all the user data, which is not recommended i.e, we should not
    // send salt, encry_password etc. so, we are undefining them.
    // Note: we are not changing in database. we are just changing in request
    req.profile.salt = undefined;
    req.profile.encry_password = undefined;
    return res.json(req.profile)
    
}


exports.getAllUsers = (req, res) =>{
    User.find().exec( (err, users) =>{
        if( err || !users){
            return res.status(400).json({
                error : "No users in the database"
            })
        }

        return res.status(200).json(users)
    })
}


// Update a user

exports.updateUser = (req,res) =>{
    User.findByIdAndUpdate(
        {_id : req.profile._id},
        {$set : req.body},
        {new : true, useFindAndModify : false},
        (err, user) =>{
            if(err){
                return res.status(400).json({
                    error : "You are not authorized user"
                })
            }
            user.salt = undefined;
            user.encry_password = undefined
            return res.status(200).json(user)
        }

    )
}

exports.userPurchaseList = (req, res) => {
    Order.find( {user : req.profile._id})
    .populate( "user" , " _id name" )
    .exec( (err, order) => {
        if(err){
            return res.status(400).json({
                err : "No orders found"
            })
        }

        return res.status(200).json(order)
    }) 
        
}

exports.pushOrderInPurchaseList = ( req, res, next) =>{
    purchases = [];
    req.body.order.products.forEach(product => {
        product.push({
            _id : product._id,
            name : product.name,
            description : product.description,
            category : product.category,
            quantity : product.quantity,
            amount : req.body.order.amount,
            transaction_id : req.body.order.transaction_id

        });
        
        
    });

    User.findByIdAndUpdate(
        { _id : req.profile._id},
        {$push : {purchases : purchases }},
        { new: true },
        ( err, purchases) =>{
            if(err){
                return res.status(400).json({
                    err :  " unable to save purchase list "
                });
            }
            next();
        }
    );
};