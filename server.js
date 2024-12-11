const express = require('express');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const addUserToViews = require('./middleware/addUserToViews');
require('dotenv').config();
require('./config/database');

const authController = require('./controllers/auth');
const recipesController = require('./controllers/recipes.js');
const ingredientsController = require('./controllers/ingredients.js');
const isSignedIn = require('./middleware/isSignedIn');

const app = express();
const port = process.env.PORT ? process.env.PORT : '3000';

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(addUserToViews);


app.get('/', async (req, res) => {
  res.render('index.ejs');
});


app.use('/auth', authController);
app.use('/recipes', recipesController);
app.use('/ingredients', ingredientsController);


app.use(isSignedIn);

app.get('/protected', async (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.sendStatus(404);
  }
});

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
