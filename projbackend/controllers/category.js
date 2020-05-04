const Category = require('../modals/category');
const { check, validationResult } = require('express-validator');


// get category items by id
exports.categoryById = ( req, res, next, id) =>{
    Category.findById(id).exec( (err, cate) =>{
        if( err || !cate){
            return res.status(400).json({
                error : 'category no found '
            })
        }
        req.category = cate
        next();
    })
}
exports.getCategory = (req, res) =>{
    return res.status(200).json(req.category);
}

// create a category
exports.createCategory = ( req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array()[0].msg });

    }
    const category = new Category(req.body)
    category.save((err, category) =>{
        if(err){
            // console.log(err)
            return res.status(400).json({
                error: "unable to create category"
            })
        }

        return res.status(200).json( {category } );
    })
}




// get all items
exports.getAllCategories = ( req, res ) =>{
    Category.find().exec( (err, category) =>{
        if(err){
            return res.status(400).json({
                err : "No categories found "
            })
        }

        return res.status(200).json(category)
    }) 

}


exports.updateCategory = ( req, res) =>{
    const category = req.category;
    category.name = req.body.name;
    category.save((err, updatedCategory) =>{
        if(err){
            return res.status(400).json({
                error: "unable to update the category"
            })
        }

        return res.status(200).json(updatedCategory);
    })
}

exports.deleteCategory = ( req, res) =>{
    const category = req.category
    category.remove( (err, category) =>{
        if(err){
            // console.log(err)
            return res.status(400).json({
                error : "Unable to delete the category"
            })
        }

        return res.status(200).json({
            "message": "successfully deleted"
        })
    })
}