const { Order, ProductCart } = require('../modals/order')

exports.getOrderById = ( req,res, next, id) => {
    // Here we use populate because order comprised of products and we want product details
    Order.findById( id)
    .populate("products.product", "name price")
    .exec( (err, order) =>{
        if(err){
            return res.status(400).json({
                err : "No order found"
            })
        }
        req.order = order;
        next();
    })
}

// creating orders

exports.createOrder = ( req, res) =>{
    // In order model we defined user. So that we can create order for a particular
    // user. That user details are comming from router.param(userID) route

    req.body.order.user = req.profile
    const order = new order(req.body.order)
    order.save( (err, newOrder) =>{
        if(err){
            return req.status(400).json({
                err : "Order not created"
            })
        }
        return req.status(200).json(newOrder)
    })
}

// Get all orders

exports.getAllOrders = ( req, res) =>{
    Order.find() 
    .populate("user", "_id name")
    .exec( (err, order) =>{
        if(err) {
            return res.status(400).json({
                err: "Unable to get all orders"
            })
        }

        return res.status(200).json(order)
    })
}

exports.getOrderStatus = ( req, res) =>{
  res.json( Order.schema.path("status").enumValues)
}, 

exports.updateStatus = ( req, res) =>{
    Order.update(
        {_id : req.body.orderId},
        {$set : {status: req.body.status}},
        ( err, orderStatus) =>{
            if(err) {
                return res.status(400).json({
                    err : "Status updation failed"
                })
            }

            return res.status(200).json(orderStatus)
        }
    )

}
