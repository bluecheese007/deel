const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models/model");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

// load routes
const contractsRoutes = require("./routes/contracts");
const jobsRoutes = require("./routes/jobs");
const balancesRoutes = require("./routes/balances");
const adminRoutes = require("./routes/admin");

// use routes
app.use("/contracts", contractsRoutes);
app.use("/jobs", jobsRoutes);
app.use("/balances", balancesRoutes);
app.use("/admin", adminRoutes);

// generic error handler
function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
}

app.use(errorHandler);

module.exports = app;
