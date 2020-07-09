const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');
const multer = require('multer');

// Initializations
const app = express();
require('./config/passport');

// settings
app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
// Interpretar image
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file , cb)=>{
      cb(null, newDate().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({storage}).single('image'));
//
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));
const MongoStore = connectMongo(session);
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// routes
app.use(require('./routes/index.routes'));
app.use(require('./routes/users.routes'));
app.use(require('./routes/contacts.routes'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;