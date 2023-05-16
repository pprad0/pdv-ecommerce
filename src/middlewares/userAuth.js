const jwt = require('jsonwebtoken')
const senhaHash = require('../SenhaHash');

const autenticarUser = async (req, res, next) => {

    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(404).json({ mensagem: 'Não autorizado !' })
    } else {

        try {
            const token = authorization.split(' ')[1]

            await jwt.verify(token, senhaHash, function (err, decoded) {


                if (err) {
                    return res.status(401).send({ messagem: "Token Invalido" })
                } else {
                    const { id } = decoded
                    req.id = id
                    next()
                }
            });



        } catch (error) {
            return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
        }

    }
}

module.exports = autenticarUser;