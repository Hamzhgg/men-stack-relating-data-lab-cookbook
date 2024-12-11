const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({

name:{
    type: String,
    required: true,
    // description: 'The name of the recipe.',//no need to add this
  },

  instructions:{
    type: String,
    required: false,
    // description: 'The cooking instructions for the recipe.',//no need to add this
  },

  owner:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:"User",
  },

  ingredients:[{
    type: mongoose.Schema.Types.ObjectId,
    // required: false,//no need to add this
    ref: "Ingredient",
  },
  ],
});

module.exports = mongoose.model('Recipe', recipeSchema);
