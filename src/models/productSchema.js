const joi = require('joi')

const productSchema = joi.object({
    descricao: joi.string().required(),
    quantidade_estoque: joi.number().required(),
    valor: joi.number().required(),
    categoria_id: joi.number().required()
})

module.exports = productSchema
