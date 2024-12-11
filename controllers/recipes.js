// controllers/recipes.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');

// router logic will go here - will be built later on in the lab

// Index Route - Show all recipes of a user
//Refactor the index route to send all recipes created by a user to the index view:
router.get('/', async (req, res) => {
	try {
		const userRecipes = await Recipe.find({ owner: req.session.user._id }).populate('ingredients');
		res.render('recipes/index.ejs', {
			recipes: userRecipes,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

  // new route 
  router.get('/new', async (req, res)=>{
  
    res.render('recipes/new.ejs');
  });

  // create
  router.post('/', async (req, res) => {
try{
  req.body.owner = req.session.user._id;
      await Recipe.create(req.body);
     res.redirect('/recipes');
}
  catch(error){
    res.redirect('/')
  } 
  }); 

  //show route
  router.get('/:recipeId', async (req, res) => {
    try{
      const recipe = await Recipe.findById(req.params.recipeId).populate(
        'ingredients'
      );
      // Get all ingredients to Users can choose to relate them in the view
      const allIngredients = await Ingredient.find({});
      res.render('recipes/show.ejs', {
        recipe: recipe,
        allIngredients: allIngredients,
      });
    }
    catch(error){
console.log(error);
res.redirect('/')
    }
  });

  //delete route
  router.delete('/:recipeId', async (req, res) => {
    try {
      await Recipe.findById(req.params.recipeId).deleteOne();
      res.redirect('/recipes');
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

  //edit route
  // modify your edit route to populate the ingredients:
  router.get('/:recipeId/edit', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipeId).populate('ingredients');
        const allIngredients = await Ingredient.find({});
        res.render('recipes/edit.ejs', {
            recipe: recipe,
            allIngredients: allIngredients,
        });
    } catch (error) {
        console.log(error);
        res.redirect('/');
    }
});

  //update route
  router.put('/:recipeId', async (req, res) => {
    try {
     // Find the existing recipe
     console.log('Update Data:', req.body); 
		const recipeToUpdate = await Recipe.findById(req.params.recipeId);
		// Update basic fields
		recipeToUpdate.name = req.body.name;
		recipeToUpdate.instructions = req.body.instructions;
		// Handling ingredients from checkboxes
		// Ensure req.body.ingredients is an array. If only one ingredient is selected, it might be a string.
		const selectedIngredients = Array.isArray(req.body.ingredients)
			? req.body.ingredients
			: [req.body.ingredients];
		// Update ingredients
		recipeToUpdate.ingredients = selectedIngredients;
		await recipeToUpdate.save();
		res.redirect(`/recipes/${req.params.recipeId}`);
    } catch (error) {
      console.log(error);
      res.redirect('/');
    }
  });

// Relating Data Routes

// GET - to render an Add Ingredients view
router.get('/:recipeId/add-ingredients', async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId).populate(
			'ingredients'
		);
		const allIngredients = await Ingredient.find({});

		res.render('recipes/add-ingredients.ejs', {
			recipe: recipe,
			allIngredients: allIngredients,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

// POST - to add ingredients to a recipe
router.post('/:recipeId/ingredients', async (req, res) => {
	try {
		const recipe = await Recipe.findById(req.params.recipeId);

		// Ensure req.body.ingredients is an array
		const ingredientIds = Array.isArray(req.body.ingredients)
			? req.body.ingredients
			: [req.body.ingredients];

		// Add selected ingredients to the recipe
		// Level up - This ensures no duplicates
		recipe.ingredients = [
			...new Set([...recipe.ingredients, ...ingredientIds]),
		];
		await recipe.save();

		res.redirect(`/recipes/${req.params.recipeId}`);
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});




module.exports = router;