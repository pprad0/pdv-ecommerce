const knex = require('../db/Connection')


const validarEmail = async (email) => {
    const emailDuplicado = await knex('clientes').where("email", email).first();
    const validacaoEmail = emailDuplicado ? true : false
    return validacaoEmail
}

const validarCpf = async (cpf) => {
    const cpfDuplicado = await knex('clientes').where("cpf", cpf).first();
    const validacaoCpf = cpfDuplicado ? true : false
    return validacaoCpf
}


const cadastrarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;

    if (cpf.includes('.') || cpf.length !== 11) {
        return res.status(400).json({ mensagem: 'Insira um cpf válido e somente números, por favor.' })
    }

    try {
        if (await validarEmail(email) || await validarCpf(cpf)) {
            return res.status(400).json({ mensagem: 'E-mail e/ou CPF já estão sendo utilizados!' });
        };

        const cliente = await knex('clientes').insert({
            nome,
            email,
            cpf,
            cep: cep || null,
            rua: rua || null,
            numero: numero || null,
            bairro: bairro || null,
            cidade: cidade || null,
            estado: estado || null
        })
            .returning('*')

        return res.status(201).json({ mensagem: "Cliente cadastrado no sistema!", cliente: cliente })

    } catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' });
    }
}


const editarCliente = async (req, res) => {
    const { nome, email, cpf, cep, rua, numero, bairro, cidade, estado } = req.body;
    const { id } = req.params

    if (cpf.includes('.') || cpf.length !== 11) {
        return res.status(400).json({ mensagem: 'Insira um cpf válido e somente números, por favor.' })
    }
    try {
        const encontrarCliente = await knex('clientes').where("id", id).first();

        if (!encontrarCliente) {
            return res.status(400).json({ mensagem: "Cliente não encontrado, insira outro 'id' de cliente." })
        }

        if (await validarEmail(email) || await validarCpf(cpf)) {
            return res.status(400).json({ mensagem: 'E-mail e/ou CPF já estão sendo utilizados!' });
        };


        const editarCliente = await knex('clientes')
            .where('id', id)
            .update({
                nome,
                email,
                cpf,
                cep: cep || null,
                rua: rua || null,
                numero: numero || null,
                bairro: bairro || null,
                cidade: cidade || null,
                estado: estado || null
            })
            .returning('*')

        return res.status(201).json({ mensagem: 'Cliente atualizado com sucesso!', cliente: editarCliente })
    }
    catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
    };
};


const listarClientes = async (req, res) => {

    try {
        const listaDeClientes = await knex('clientes').returning('*');
        return res.status(200).json(listaDeClientes);

    } catch {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' });
    }
}


const detalharCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const encontrarCliente = await knex('clientes').where("id", id).first();

        if (!encontrarCliente) {
            return res.status(400).json({ mensagem: "Cliente não encontrado, insira outro 'id' de cliente." })
        }

        return res.status(200).json(encontrarCliente);

    } catch (error) {
        return res.status(500).json({ mensagem: 'O servidor apresentou um erro !' })
    }
};

module.exports = {
    cadastrarCliente,
    editarCliente,
    listarClientes,
    detalharCliente
};
