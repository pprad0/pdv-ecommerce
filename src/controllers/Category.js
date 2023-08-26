const knex = require('../db/Connection')

const listarCategories = async (req, res) => {

    try {
        const categoriaListar = await knex('categorias').returning('*')
        return res.status(200).json(categoriaListar)

    } catch (error) {
        return res.status(500).json({ mensagem: "O servidor apresentou um erro!" })
    }
}
console.log("teste")



module.exports = listarCategories;