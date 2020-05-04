const Product = require('../modals/product');
const formidable = require('formidable')
const fs = require("fs");
const _ = require('lodash');

exports.getProductById = ( req, res, next, id) =>{
    Product.findById(id)
    .populate("category")
    .exec( (err, product) =>{
        if(err || !product){
            console.log(err)
            return res.status(400).json({
                err : "Unable to get the product"
            })
        }

        req.product = product
        next();
    })
}

exports.getProduct = (req, res) => {
    req.product.photo = undefined
    return res.json(req.product)
};

//middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
};


exports.getAllProducts = ( req, res) =>{
    let limit = req.query.limit ? parseInt( req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[ sortBy, "asc"]])
    .limit(limit)
    .exec(( err, products) =>{
        if(err){
            return res.status(400).json({
                error : "No Product found"
        })
    }
    res.json(products)
        
            
        
    })
    
}

exports.createProduct = ( req, res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse( req, (err, fields, file) =>{
        if(err){
            return res.status(400).json({
                err : "Unable to upload the photo"
            })
        }
        // Todo restrictions on filelds
        const { name, description, price, category, stock } = fields
        if( !name || !description ||!price ||!category || !stock){
            return res.status(400).json({
                err : "All fields required"
            })
        }
        let product = new Product(fields)

        // handle files
        if(file.photo){
            // File size should not be more than 3MB
            if( file.photo.size > 3000000){
                return res.status(400).json({
                    err : "Photo size should be less than 3MB"
                })

            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type

        }

        product.save( ( err, product) =>{
            if(err){
                return res.status(400).json({
                    err : "unable to save product in database"
                })
            }
            return res.status(200).json(product)
        })

    })

}


exports.deleteAProduct = ( req, res) =>{
    const product = req.product;
    product.remove( ( err, deletedProduct) =>{
        if( err || !deletedProduct){
            return res.status(400).json({
                err : "Product deletion failed"
            })
        }

        return res.status(200).json(deletedProduct)
    })
}

// Update a product

exports.updateProduct = (req, res) =>{

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse( req, (err, fields, file) =>{
        if(err){
            return res.status(400).json({
                err : "Unable to upload the photo"
            })
        }
        
        // code for updation
        let product = req.body
        product = _.extend(product, fields)        

        // handle files
        if(file.photo){
            // File size should not be more than 3MB
            if( file.photo.size > 3000000){
                return res.status(400).json({
                    err : "Photo size should be less than 3MB"
                })

            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type

        }

        product.save( ( err, product) =>{
            if(err){
                return res.status(400).json({
                    err : "unable to update theproduct in database"
                })
            }
            return res.status(200).json(product)
        })

    })

}

// Get all categories

exports.getAllUniqueCategories = ( req, res) =>{
    // distinct() helps us to get all uniques values check Model.distinct() in docs
    Product.distinct("category", {}, (err, category) =>{
        if(err){
            return res.status(400).json({
                err : "Unable to get categories"
            })
        }

        return res.status(200).json(category)
    })
}


// Once the products are purchased we need to update stock and sold(2 operations at a time)
// this can be done with mongoose.bulkWrite()

exports.updateStock =  (req, res, next) =>{
    // Here we are looping through all products in the order
    let myOperations = req.body.order.products.map( prod =>{
        return{
            updateOne : {
                filter : { _id : prod._id},
                update : { $inc : { stock : -prod.count , sold : +prod.count}}
            }
        }

    });
    // bulkWrite() always takes three parameters
    product.bulkWrite( myOperations, {}, ( err, products) =>{
        if(err){
            return res.status(400).json({
                err : "unable to update the inventory"
            })
        }
        next()
    })
}


