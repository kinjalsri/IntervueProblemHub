const Joi = require('joi');

const problemValidation = (req, res, next) => {

    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        company_name: Joi.string().required(),
        is_anonymous: Joi.boolean(),
        tag_ids: Joi.array().items(Joi.number())
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

module.exports = {
    problemValidation
};