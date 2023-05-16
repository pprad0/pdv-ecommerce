const joi = require('joi')

const clientSchema = joi.object({
    nome: joi.string().required(),
    email: joi.string().email().required(),
    cpf: joi.number().required()
})

module.exports = clientSchema