const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;


const productCartSchema = new mongoose.Schema({
    
    // About each product in the cart
    product : {
        type : ObjectId,
        ref : "Product"
    },

    name : String,
    count : Number,
    price : Number
})

const ProductCart = mongoose.model('ProductCart', productCartSchema)

const orderSchema = new mongoose.Schema({
    
    // products in the cart
    
    products : [productCartSchema],
    transcation_id : {},
    amount : { type : Number},
    address : String,

    status: {
        type : String,
        default : "Received",
        enum : [ "Cancelled", "Delivered", "Shipped", "Processing", "Received"]
    },

    updated : Date,
    user :{
        type : ObjectId,
        ref : "User"
    }


},
{
    timestamps : true
})

const Order = mongoose.model("Order", orderSchema);


module.exports = { Order, ProductCart }