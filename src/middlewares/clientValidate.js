const express = require('express');
const { messages } = require('joi-translation-pt-br')
const clientSchema = require("../models/clientSchema");


const clientValidation = (request, response, next) => {
    const { nome, email, cpf } = request.body

    const result = clientSchema.validate({
        nome: nome,
        email: email,
        cpf: cpf

    }, { messages });


    if (result.error) {

        return response.status(400).send({ message: result.error.details[0].message.replace(/["\\]/g, '') })

    } else {
        next()
    }
}

module.exports = clientValidation