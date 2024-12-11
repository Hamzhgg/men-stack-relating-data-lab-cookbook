const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({

name:{
    type: String,
    required: true,
    // description: 'The name of the ingredient.', no need to add this line
},
});

module.exports = mongoose.model('Ingredient', ingredientSchema);