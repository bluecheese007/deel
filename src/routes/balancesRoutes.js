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

const { check, validationResult } = require("express-validator");
const JobServices = require("./services/jobServices");

/**
 * Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay. (at the deposit moment)
 * @returns contract
 */
app.post(
    "/deposit",
    [check("deposit").isNumeric()],
    getProfile,
    async (req, res) => {
      const validation = validationResult(req);
      if (!validation.isEmpty()) {
        return res.status(400).json({ errors: validation.array() });
      }
      var client = req.profile;
      // This method only works for client profiles
      if (client.type != "client") {
        return res.status(405).end(); // Return method not allowed
      }
      var deposit = req.body.deposit;
      var result = await JobServices.deposit(client, deposit);
        res.json(result);
    }
  );

module.exports = router;