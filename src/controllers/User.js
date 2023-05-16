const knex = require('../db/Connection')
const bcrypt = require('bcrypt');;
const schema = require('../models/userSchema');


const cadastrarUser = async (req, res) => {
    const { nome, email, senha } = req.body


    try {
        const existeEmail = await knex('usuarios').where({ email }).first()

        if (existeEmail) {
            return res.status(400).json({ Message: 'Email já cadastrado !' })
        }

        const senhAcrip = await bcrypt.hash(senha, 10)

        const usuario = await knex('usuarios').insert({
            nome,
            email,
            senha: senhAcrip
        })

        return res.status(201).send()

    } catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
    }
}

const detalharUser = async (req, res) => {
    const id = req.id
    const userExistente = await knex('usuarios').where({ id }).first()

    if (!userExistente) {
        return res.status(404).json({ mensagem: 'Não autorizado !' })
    }

    const { senha: _, ...usuario } = userExistente

    req.usuario = usuario

    return res.status(200).json({ usuario: req.usuario })
}

const editarUser = async (req, res) => {
    const { nome, email, senha } = req.body

    try {

        const existeEmail = await knex('usuarios').where({ email }).first()

        if (existeEmail) {
            return res.status(400).json('Email já cadastrado !')
        }

        const senhAcrip = await bcrypt.hash(senha, 10)

        const usuario = await knex('usuarios')
            .where('id', '=', req.id)
            .update({
                nome,
                email,
                senha: senhAcrip
            })

        process.on('SIGINT', async () => {
            await knex.destroy();
            process.exit(0);
        })

        return res.status(201).send()

    } catch (error) {

        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
    }
}

module.exports = {
    cadastrarUser,
    detalharUser,
    editarUser
};