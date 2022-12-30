const { check, validationResult } = require('express-validator');

// Generic date validator
const datesValidator = async (req, res, next) => {
    await check("start").isISO8601().toDate().run(req);
    await check("end").isISO8601().toDate().run(req);
    await check('start').toDate().custom((sd, { req }) => {
        if (sd.getTime() >= req.query.end.getTime()) {
            throw new Error('start date must be before end date');
        }
        return true;
    }).run(req);

    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      return res.status(400).json({ errors: validation.array() });
    }

    next()
}

// TODO - add more validators here as needed but keep them generic


module.exports = {datesValidator} 