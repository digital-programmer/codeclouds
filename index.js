const express = require("express");
const app = express();
const env = require('./config/environment');
const cookieParser = require('cookie-parser');
const expressLayouts = require("express-ejs-layouts");
const flash = require('connect-flash');
const logger = require("morgan");
const db = require("./config/mongoose");
const port = 8000;
const path = require('path');

// used for session cookie
const session = require('express-session');
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const MongoStore = require('connect-mongo');
const customWare = require("./config/middleware");

app.use(express.static(path.join(__dirname, env.asset_path)));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expressLayouts);

// extract style and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set view engine and view route
app.set("view engine", "ejs");
app.set("views", "./views");


// mongo store is used to store the session cookie in the db
app.use(session({
    name: "codeclouds",
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            client: db.getClient(),
            autoRemove: 'disabled',
        },
        function (err) {
            console.log(err || "connect-mongodb setup ok");
        })
}));


// initialize session
app.use(passport.initialize());
app.use(passport.session());

// set user
app.use(passport.setAuthenticatedUser);

// setup flash messages
app.use(flash());
app.use(customWare.setFlash);

// use express router to connect
app.use("/", require("./routes"));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running server: ${err}`);
    }
    console.log(`Server is running on port ${port}`);
});