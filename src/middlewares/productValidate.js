const express = require('express');
const { messages } = require('joi-translation-pt-br')
const productSchema = require("../models/productSchema");


const productValidation = (request, response, next) => {
    const { descricao, quantidade_estoque, valor, categoria_id } = request.body


    const result = productSchema.validate({
        descricao: descricao,
        quantidade_estoque: quantidade_estoque,
        valor: valor,
        categoria_id: categoria_id

    }, { messages });


    if (result.error) {

        return response.status(400).send({ message: result.error.details[0].message.replace(/["\\]/g, '') })

    } else {
        next()
    }
}

module.exports = productValidation