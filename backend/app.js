const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const itemsRoutes = require("./router/item_router");
const coursevilleRoutes = require("./router/courseview_router");


const sessionOptions = {
    secret: "my-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
        // setting this false for http connections
        secure: false,
    },
};

const corsOptions = {
    origin: true,
    credentials: true,
};


const app = express();


app.use(express.static("static"));
app.use(cors(corsOptions));
app.use(session(sessionOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/items", itemsRoutes);
app.use("/courseville", coursevilleRoutes);

module.exports = app;