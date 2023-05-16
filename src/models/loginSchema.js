const Joi = require('joi')
const { messages } = require('joi-translation-pt-br')


const loginSchema = Joi.object().keys({

    email: Joi.string().email({ tlds: { allow: false } }).required(),
    senha: Joi.string().required(),
});



module.exports = {
    loginSchema
}