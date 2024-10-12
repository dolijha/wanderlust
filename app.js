if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ExpressError=require("./utils/ExpressError.js");
const ejsMate=require("ejs-mate");
const session =require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localstrategy=require("passport-local");
const User=require("./models/user.js");

const listingrouter=require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter= require("./routes/user.js");


//const mongo_url="mongodb://127.0.0.1:27017/wonderlust";
const dbUrl=process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24 *3600,
})

store.on("error",()=>{
    connect.log("ERROR in MONGO SESSION STORE",err);
})
const sessionOption={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true
};


app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
res.locals.success=req.flash("success");
res.locals.error=req.flash("error");
res.locals.currUser=req.user;
next();
});




app.use("/listings",listingrouter);
app.use("/listings/:id/reviews",reviewrouter);
app.use("/",userrouter);





/*app.get("/testListings",async(req,res)=>{
 let sampleListing=new Listing({
    title:"my new villa",
    description:"by the beach",
    price: 1200,
    location:"delhi",
    country:"india"
 });
 
 await sampleListing.save();
 console.log("sample was saved");
 res.send("successfull testing");
});
*/
app.all("*",(req,res,next)=>{
   next(new ExpressError(404,"page not found"));
});
app.use((err,req,res,next)=>{
let{statusCode=500,message="something went wrong"}=err;
res.status(statusCode).render("error.ejs",{message})
//res.status(statusCode).send(message);
});
 

app.listen("8080",()=>{
    console.log("server is listening for port 8080");
});