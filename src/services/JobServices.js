const { Op } = require("sequelize");
const { sequelize } = require("../models/model");
var models = require("../models/model");

module.exports = class JobServices {
  static async getUnpaid(profile) {
    const { Job, Contract } = models;

    // This allows filter by client or contractor
    var condition;
    if (profile.type == "client") {
      condition = { "$Contract.ClientId$": profile.id };
    } else if (profile.type == "contractor") {
      condition = { "$Contract.ContractorId$": profile.id };
    }

    const result = await Job.findAll({
      where: {
        paid: null,
        "$Contract.status$": {
          [Op.or]: ["new", "in_progress"], // Active contracts
        },
        [Op.or]: condition,
      },
      include: [
        {
          model: Contract,
        },
      ],
    });

    return result;
  }

  static async pay(client, jobId) {
    const { Job, Contract, Profile } = models;
    
    // operations are executed via transaction
    var result = await sequelize.transaction({
      lock: Transaction.LOCK.UPDATE, // Concurrence control
    }, async (t) => {
      try {
        const jobResult = await Job.findOne({
          where: {
            id: jobId,
            paid: null,
            "$Contract.ClientId$": client.id,
          },
          include: [
            {
              model: Contract,
            },
          ],
        });

        if (!jobResult) return null;

        var amount = jobResult.price;

        // the client only can pay if the balance is greater or equal than amount
        if (client.balance < amount) {
          throw new Error(
            "balance is less than amount. You need to charge your account"
          );
        }

        var contract = jobResult.Contract;
        var contractorId = contract.ContractorId;

        await Profile.update(
          { balance: sequelize.literal("balance + " + amount) },
          { where: { id: contractorId }, transaction: t }
        );
        await Profile.update(
          { balance: sequelize.literal("balance - " + amount) },
          { where: { id: client.id }, transaction: t }
        );
        // Mark job as paid
        await Job.update(
          { paid: true, paymentDate: sequelize.literal('CURRENT_TIMESTAMP') },
          { where: { id: jobId }, transaction: t }
        );
      } catch (e) {
        throw e;
      }
    });

    return true;
  } 

  static async deposit(client, deposit) {
    const { Job, Contract } = models;

    var maxPriceResult = await Job.findOne({
      attributes: [[sequelize.fn("sum", sequelize.col("price")), "maxPrice"]],
      raw: true,
      where: {
        paid: null,
        "$Contract.ClientId$": client.id,
      },
      include: [
        {
          model: Contract,
        },
      ],
    });

    const max = maxPriceResult.maxPrice * 0.25;

    if (deposit > max) {
      throw new Error(
        "A client can't deposit more than 25% his total of jobs to pay. In this case max: " +
          max
      );
    }

    const { Profile } = models;

    // operations are executed via transaction
    var result = await sequelize.transaction(async (t) => {
      try {
        await Profile.update(
          { balance: sequelize.literal("balance + " + deposit) },
          { where: { id: client.id }, transaction: t }
        );
        //other operations in the future
      } catch (e) {
        throw e;
      }
    });

    return true;
  }
};
