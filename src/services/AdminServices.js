const { Op, QueryTypes } = require("sequelize");
const { sequelize } = require("../models/model");

module.exports = class AdminServices {
  static async getBestProfession(start, end) {
    var query = `
        SELECT 
            Profiles.profession
        FROM  
            Profiles 
        INNER JOIN 
            Contracts 
        ON 
            Profiles.id = Contracts.ContractorId 
        INNER JOIN 	
            Jobs 
        ON 
            Contracts.id = JOBS.ContractId 
        WHERE 
            Jobs.paid = 1
        AND
            Contracts.createdat BETWEEN :start and :end
        GROUP BY
            Profiles.profession
        ORDER BY
            SUM(Jobs.price) DESC
        LIMIT 1  
    `;
    const result = await sequelize.query(query, {
      replacements: { start, end },
      type: QueryTypes.SELECT,
    });
    return result;
  }

  static async getBestClients(start, end, limit) {
    var query = `
        SELECT 
            Profiles.id,
            Profiles.firstName || " " || Profiles.lastName as "fullName",
            sum(Jobs.price) as paid
        FROM  
            Profiles 
        INNER JOIN 
            Contracts 
        ON 
            Profiles.id = Contracts.ClientId
        INNER JOIN 	
            Jobs 
        ON 
            Contracts.id = Jobs.ContractId 
        WHERE	
            Jobs.paid = 1
        AND
            Jobs.paymentDate BETWEEN :start and :end
        GROUP BY
            Profiles.id,
            Profiles.firstName,
            Profiles.lastName
        LIMIT :limit 
    `;
    const result = await sequelize.query(query, {
      replacements: { start, end, limit },
      type: QueryTypes.SELECT,
    });
    return result;
  }
};
