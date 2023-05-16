const express = require('express');
const { messages } = require('joi-translation-pt-br')
const loginSchema = require("../models/loginSchema");


const loginValidationMiddleware = (request, response, next) => {
    const { email, senha } = request.body

    const result = loginSchema.loginSchema.validate({
        email: email,
        senha: senha

    }, { messages });


    if (result.error) {

        return response.status(400).send({ message: result.error.details[0].message.replace(/["\\]/g, '') })
    } else {
        next()
    }
}

module.exports = loginValidationMiddleware