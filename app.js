require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const session = require("express-session")
const passport = require('passport');
const morgan = require("morgan");
const cors = require("cors")

const app = express();


const indexRouter = require("./routers/index");
const authRouter = require("./routers/auth");
const adminRouter = require("./routers/admin")
const productRouter = require("./routers/product")
const categoryRouter = require("./routers/category")
const userRouter = require("./routers/user")
const cartRouter = require("./routers/cart")
const paymentRouter = require("./routers/payment")
const orderRouter = require("./routers/order")

require("./config/google_auth_config")
require("./config/db");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



// app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser())
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));



app.use(cors({
  origin: true,
  credentials:true
}))


/// development loggers
if(
  typeof process.env.NODE_ENV !== "undefined" &&
  process.env.NODE_ENV === "development"
){
  console.log("in develoement mode");
}


app.use("/", indexRouter);
app.use("/auth", authRouter)
app.use("/admin", adminRouter);
app.use("/products", productRouter)
app.use("/category", categoryRouter)
app.use("/users", userRouter);
app.use("/cart", cartRouter)
app.use('/payment', paymentRouter)
app.use('/order', orderRouter)



app.listen(3000, ()=> {
  console.log("server is listening on port http://localhost:3000");

})