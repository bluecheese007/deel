const express = require("express");
const router = express.Router();
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models/model");
const { getProfile } = require("./middleware/getProfile");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);
const ContractServices = require("./services/contractServices");

/**
 * Returns the contract only if it belongs to the profile calling
 * @returns contract
 */
app.get("/:id", getProfile, async (req, res) => {
    const { id } = req.params;
    var result = await ContractServices.getById(req.profile, id);
    if (!result) return res.status(404).end();
    res.json(result);
  });
  
  /**
   * Returns a list of non terminated contracts belonging to a user (client or contractor)
   * @returns contract
   */
  app.get("/", getProfile, async (req, res) => {
    var result = await ContractServices.getAll(req.profile);
    if (!result) return res.status(404).end();
    res.json(result);
  });

module.exports = router;