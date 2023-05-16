const knex = require('../db/Connection');
const { transportador } = require('../controllers/email');

const cadastrarPedido = async (req, res) => {
    const { cliente_id, observacao, pedido_produtos } = req.body;

    if (!cliente_id || !pedido_produtos) {
        return res.status(400).json({ mensagem: "Preencha 'cliente_id' e 'pedido_produtos'." });
    };

    try {

        const clienteExiste = await knex('clientes').where('id', "=", cliente_id).first();
        if (!clienteExiste) {
            return res.status(404).json({ mensagem: 'Cliente não encontrado!' });
        };


        let cadastrarTodosItens = [];
        for (let item of pedido_produtos) {

            if (!item.produto_id || item.produto_id <= 0 || !item.quantidade_produto || item.quantidade_produto <= 0) {
                return res.status(400).json({ mensagem: 'Produto_id e quantidade_produto precisam estar preenchidos. Verifique se não foram colocados valores menores que 1 (um) nestes campos.' });
            }

            const encontrarProduto = await knex('produtos').where('id', "=", item.produto_id).first();
            if (!encontrarProduto) {
                return res.status(404).json({ mensagem: 'Produto não encontrado!' });
            };

            if (encontrarProduto.quantidade_estoque < item.quantidade_produto) {
                return res.status(400).json({ mensagem: 'Estoque insuficiente!' });
            }


            let pedido = {
                cliente_id,
                observacao: observacao || null,
                produto_id: item.produto_id,
                quantidade_produto: item.quantidade_produto
            }

            cadastrarTodosItens.push(pedido);
        };

        await knex('pedidos').insert(cadastrarTodosItens);


        transportador.sendMail({
            from: `${process.env.EMAIL_NAME} <${process.env.EMAIL_FROM}>`,
            to: `${clienteExiste.nome} <${clienteExiste.email}>`,
            subject: 'Pedido cadastrado com sucesso!',
            text: `Olá, ${clienteExiste.nome}, seu pedido acaba de ser cadastrado em nosso sistema!`

        });

        return res.status(201).json({ mensagem: `Email enviado para ${clienteExiste.email} com sucesso! ` });

    } catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro!' });
    }
};

const listarPedido = async (req, res) => {

    try {
        const pedidos = await knex('pedidos');
        return res.status(200).json(pedidos);

    } catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro!' });
    }
};

const listarPedidoId = async (req, res) => {
    const { id } = req.params;

    try {

        const verificarId = await knex('clientes').where('id', id);

        if (!verificarId) {
            return res.status(400).json({ mensagem: 'Cliente não encontrado!' });
        };

        const pedidosId = await knex('pedidos').where('id', id).first();

        return res.status(200).json(pedidosId);

    } catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro!' });
    }
};



module.exports = { cadastrarPedido, listarPedido, listarPedidoId };
