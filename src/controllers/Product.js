const { isNumber } = require('class-validator')
const knex = require('../db/Connection')
const { id } = require('../models/productSchema')

const aws = require('aws-sdk')

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3)

const s3 = new aws.S3({

    endpoint,
    credentials: {
        accessKeyId: process.env.G06_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.G06_AWS_SECRET_ACCESS_KEY
    }

})


const cadastrarProduto = async(req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body

    if (quantidade_estoque < 0) {
        return res.status(400).json({ mensagem: 'A quantidade em estoque deve ser igual ou maior que zero ! ' })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor do produto deve ser maior que zero ! ' })
    }

    try {
        if (produto_imagem) {
            const imagem = await knex.raw('SELECT * FROM produtos WHERE produto_imagem =?', produto_imagem)
            if (imagem.rows.length > 0) {
                return res.status(400).json({ mensagem: "Imagem já cadastrada em outro produto" })
            }
        }

        const categoriaExiste = await knex('categorias').where("id", "=", categoria_id).first()
        if (!categoriaExiste) {
            return res.status(404).json({ mensagem: 'Categoria não encontrada, informe outra categoria.' })
        }

        const inserirProduto = await knex('produtos')
            .insert({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id,
                produto_imagem: produto_imagem || null
            })
            .returning('*')

        return res.status(201).send(inserirProduto)


    } catch (error) {

        return res.status(500).json({ mensagem: error })
    }
}

const atualizarProduto = async(req, res) => {
    const { descricao, quantidade_estoque, valor, categoria_id, produto_imagem } = req.body
    const { id } = req.params

    if (quantidade_estoque < 0) {
        return res.status(400).json({ mensagem: 'A quantidade em estoque deve ser igual ou maior que zero! ' })
    }
    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'O valor do produto deve ser maior que zero! ' })
    }

    try {
        const categoriaExiste = await knex('categorias')
            .where("id", "=", categoria_id)
            .first()

        if (!categoriaExiste) {
            return res.status(404).json({ messagem: 'Categoria não encontrada, informe outra categoria.' })
        }


        const existeProduto = await knex('produtos')
            .where({ id })
            .first()

        if (!existeProduto) {
            return res.status(404).json({ mensagem: "Produto não existe, informe outro 'id' " })
        }

        if (existeProduto.produto_imagem) {
            try {
                await s3.deleteObject({
                    Bucket: process.env.BACKBLAZE_BUCKET,
                    Key: existeProduto.produto_imagem
                }).promise()

            } catch (error) {
                return res.status(404).json({ erro: error.message, mensagem: "Certifique-se de que 'produto_imagem' seja o valor da propriedade 'path' no upload de arquivo. Caso esteja correto, comunique nosso suporte. " })
            }
        }

        const atualizarProduto = await knex('produtos')
            .where('id', '=', id)
            .update({
                descricao,
                quantidade_estoque,
                valor,
                categoria_id,
                produto_imagem: produto_imagem || null
            })

        return res.status(201).json()
    } catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
    }

}

function validarId(id, res) {

    return !isNaN(id)


}

const listarProdutosPorCategoria = async(req, res) => {

    const { categoria_id } = req.query

    if (!categoria_id) {
        try {
            const produtosListar = await knex.raw('SELECT p.*,categorias.descricao as categoria FROM produtos as p JOIN categorias  ON categoria_id = categorias.id  ')
            return res.status(200).json({ listagem: produtosListar.rows })
        } catch (error) {
            return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
        }
    } else if (validarId(categoria_id)) {

        try {

            const produtosListar = await knex.raw('SELECT p.*,categorias.descricao as categoria FROM produtos as p JOIN categorias  ON categoria_id = categorias.id WHERE categoria_id=? ', categoria_id)
            return res.status(200).json({ listagem: produtosListar.rows })

        } catch (error) {
            return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
        }


    } else {
        return res.status(400).json({ mensagem: 'Parâmetro inválido,Insira somente números !' })

    }
}
async function consultarProduto(id) {


    const produtoExiste = await knex('produtos')
        .where("id", "=", id)
        .first()

    return produtoExiste ? produtoExiste : false


}
const listarProduto = async(req, res) => {

    const { id } = req.params
    if (validarId(id)) {
        const produto = await consultarProduto(id)

        if (produto) {
            return res.status(200).json(produto)
        } else {
            return res.status(404).json({ mensagem: "Produto não encontrado" })
        }
    } else {
        return res.status(400).json({ mensagem: 'Parâmetro inválido,Insira somente números !' })
    }


}
const excluirProduto = async(req, res) => {

    const { id } = req.params

    if (validarId(id)) {
        const produto = await consultarProduto(id)

        if (produto) {
            try {
                const produtoExcluir = await knex.raw('SELECT * FROM pedidos WHERE produto_id = ?', id)
                if (produtoExcluir.rows.length > 0) {

                    return res.status(401).json({ Message: "O produto não pode ser excluido, pois esta vinculado a um pedido " })
                } else {
                    try {
                        const produtoExcluir = await knex.raw('SELECT * FROM produtos WHERE id = ?', id)
                        const imagem = produtoExcluir.rows[0].produto_imagem
                        if (imagem) {
                            await s3.deleteObject({
                                Bucket: process.env.BACKBLAZE_BUCKET,
                                Key: imagem
                            }).promise()
                        }
                        const teste = await knex("produtos").del().where({ id: produto.id })

                        return res.status(200).json({ mensagem: "Produto excluido com sucesso!!" })
                    } catch (error) {
                        return res.status(404).json({ mensagem: "Produto não encontrado" })
                    }
                }
            } catch (error) {
                return error
            }


        } else {
            return res.status(404).json({ mensagem: "Produto não encontrado" })
        }

    } else {
        return res.status(400).json({ mensagem: 'Parâmetro inválido, insira somente números !' })
    }

}



module.exports = {
    cadastrarProduto,
    atualizarProduto,
    listarProdutosPorCategoria,
    listarProduto,
    excluirProduto
}