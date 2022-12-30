const express = require("express");
const router = express.Router();
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models/model");
const { getProfile } = require("./middleware/getProfile");
const { datesValidator } = require("./middleware/datesValidator");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);
const AdminServices = require("./services/adminServices");


/**
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time range.
 * @returns contract
 */
app.get(
    "/best-profession",
    datesValidator,
    getProfile,
    async (req, res) => {
      let start = req.query.start;
      let end = req.query.end;
      var result = await AdminServices.getBestProfession(start, end);
      if (result == null || result.length == 0) {
        res.status(404).end();
      }
      res.json(result[0]);
    }
  );
  
  /**
   * Returns the clients the paid the most for jobs in the query time period. default limit is 2.
   * @returns contract
   */
  app.get("/best-clients", datesValidator, getProfile, async (req, res) => {
    let start = req.query.start;
    let end = req.query.end;
    let limit = req.query.limit || 2;
    var result = await AdminServices.getBestClients(start, end, limit);
    if (result == null) {
      res.status(404).end();
    }
    res.json(result);
  });
  

module.exports = router;