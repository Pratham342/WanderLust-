if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;

main().then(() =>{
    console.log("connection success");
}).catch((err) =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
};

let port = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public/css")));
app.use(express.static(path.join(__dirname, "/public/js")));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", () =>{
    console.log("Error in MONGO SESSION STORE", err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};

app.get("/", (req,res) =>{
    res.redirect('/listings');
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for defining locals 
app.use((req, res, next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// middlewares end and API requrests starts 

app.get("/demouser", async(req, res) =>{
    let fakeUser = new User({
        email: "student@gmail.com",
        username: "delta-student",
    });

    let newUser = await User.register(fakeUser, "helloworld");
    res.send(newUser);
});

// listings router which will connect the app.js with listing.js in routes folder which contains the listing routes to keep the code structured and clean 
app.use("/listings", listingRouter);

// reviews router which will connect the app.js with review.js in routes folder which contains the review routes to keep the code structured and clean 
app.use("/listings/:id/reviews", reviewRouter);

// users router which will connect the app.js with user.js in routes folder which contains the user routes to keep the code structured and clean 
app.use("/", userRouter);

// error handling middlewares
app.all("*", (req, res, next) =>{
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) =>{
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});
// error handling middlewares

app.listen(port, () =>{
    console.log(`app is listetning at port ${port}`);
});



