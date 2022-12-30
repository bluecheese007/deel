const { Op, QueryTypes } = require("sequelize");

var models = require("../models/model");

module.exports = class ContractServices {
  static async getById(profile, id) {
    const { Contract } = models;

    // This allows filter by client or contractor
    var condition;
    if (profile.type == "client") {
      condition = { ClientId: profile.id };
    } else if (profile.type == "contractor") {
      condition = { ContractorId: profile.id };
    }

    const result = await Contract.findOne({
      where: {
        id,
        [Op.or]: condition,
      },
    });

    return result;
  }

  static async getAll(profile) {
    const { Contract } = models;

    // This allows filter by client or contractor
    var condition;
    if (profile.type == "client") {
      condition = { ClientId: profile.id };
    } else if (profile.type == "contractor") {
      condition = { ContractorId: profile.id };
    }

    const result = await Contract.findAll({
      where: {
        status: {
          [Op.or]: ["new", "in_progress"],
        },
        [Op.or]: condition,
      },
    });

    return result;
  }
};
