const express = require('express');
const { messages } = require('joi-translation-pt-br')
const userSchema = require("../models/userSchema");


const validationMiddlewareUser = (request, response, next) => {
    const { nome, email, senha } = request.body


    const result = userSchema.userSchema.validate({
        nome: nome,
        email: email,
        senha: senha

    }, { messages });


    if (result.error) {

        return response.status(400).send({ message: result.error.details[0].message.replace(/["\\]/g, '') })

    } else {
        next()
    }
}

module.exports = validationMiddlewareUser