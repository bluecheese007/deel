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
const JobServices = require("./services/jobServices");


/**
 * Get all unpaid jobs for a user (a client or contractor), for active contracts only (new or in_progress)
 * @returns contract
 */
app.get("/unpaid", getProfile, async (req, res) => {
    var result = await JobServices.getUnpaid(req.profile);
    if (!result) return res.status(404).end();
    res.json(result);
  });
  
  /**
   * Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.
   * @returns contract
   */
  app.post("/:job_id/pay", getProfile, async (req, res) => {
    var client = req.profile;
    // This method only works for client profiles
    if (client.type != "client") {
      return res.status(405).end(); // Return method not allowed
    }
    var jobId = req.params.job_id;
    var result = await JobServices.pay(client, jobId);
    if (!result) return res.status(404).end();
    res.json(result);
  });

module.exports = router;