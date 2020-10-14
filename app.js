const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { ValidationError } = require("sequelize");
const usersRouter = require("./routes/users");
const itemsRouter = require("./routes/items")
const { environment } = require('./config');

const { authConfig, checkJwt } = require("./auth0");
const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(cors({ origin: "*" }));

app.use("/users", usersRouter);
app.use("/items", itemsRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the express-sequelize-starter!");
});

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
    const err = new Error("The requested resource couldn't be found.");
    err.status = 404;
    next(err);
});

// Custom error handlers.

// Generic error handler.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.json({
        title: err.title || "Server Error",
        message: err.message,
        stack: isProduction ? null : err.stack,
    });
});

module.exports = app;